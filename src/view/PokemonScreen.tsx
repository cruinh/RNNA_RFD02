import { Image, Pressable, RefreshControl, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View } from "react-native";
import { useAppDispatch, useAppSelector } from "../state/rootStore";
import { useEffect, useState } from "react";
import { fetchPokemonDetails, incrementDisplayedFlavorText, Pokemon, resetPokemon } from "../state/pokemonSlice";
import { Colors } from "react-native/Libraries/NewAppScreen";

export interface PokemonScreenProps {
    route: {
        params: {
            url: string
        }
    }
}

export function PokemonScreen(props: PokemonScreenProps): React.JSX.Element {
    const [refreshing, setRefreshing] = useState(false)
    const { route: { params : { url }} } = props
    const appDispatch = useAppDispatch()

    useEffect(() => {
        appDispatch(fetchPokemonDetails(url))
    }, [appDispatch])

    const details : Pokemon = useAppSelector((state) => state.pokemon)

    const isDarkMode = useColorScheme() === 'dark'
    const styles = StyleSheet.create({
        background: {
            flex: 1,
            backgroundColor: isDarkMode ? Colors.darker : Colors.lighter
        },
        scrollView: {
            flex: 1
        },
        scrollViewContent: {
            flex: 1,
            margin: 10
        },
        detailText: {
            color: isDarkMode ? Colors.lighter : Colors.darker
        },
        nameText: {
            fontSize: 40
        },
        sprite: {
            width: 200,
            height: 200
        },
        spriteContainer: {
            flex: 1
        },
        spriteRow: {
            flexDirection: 'row'
        }
    })
    const nameStyle = {...styles.detailText, ...styles.nameText}
    const flavorStyle = {
        ...styles.detailText, 
        marginTop: 10, 
        marginBottom: 10
    }

    const { species: { flavor_text_entries, displayFlavorIndex} } = details
    const entries = flavor_text_entries || []
    const entry = entries.length > displayFlavorIndex ? entries[displayFlavorIndex] : { flavor_text: '' }

    let flavorText = entry.flavor_text.split('\n').join(' ').split('\f').join(' ')
    flavorText = `${flavorText}\n\n(variation ${displayFlavorIndex} of ${entries.length})`

    const { sprites } = details

    const Sprite = (props: {src: string}) => {
        const { src } = props
        return (
            <Image style={styles.sprite} src={src}/>
        )
    }

    const SpriteSection = (props: { title: string, front_url?:string, back_url?:string}) => {
        const {title, front_url, back_url} = props
        return (
            <View>
                {(front_url && back_url) ?
                    <View style={styles.spriteContainer}>
                        <Text style={styles.detailText}>{title}</Text>
                        <View style={styles.spriteRow}>
                            <Sprite src={front_url}/>
                            <Sprite src={back_url}/>
                        </View>
                    </View>
                    : null
                }
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.background}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={styles.background.backgroundColor}
            />
            <ScrollView style={styles.scrollView}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {
                            appDispatch(resetPokemon())
                            appDispatch(fetchPokemonDetails(url))
                        }}
                    />
                }
            >
                <View style={styles.scrollViewContent}>
                    <Text style={nameStyle}>{details.name} #{details.id}</Text>
                    <Pressable onPress={() => {
                        appDispatch(incrementDisplayedFlavorText())
                    }}>
                        <Text style={flavorStyle}>{flavorText}</Text>
                    </Pressable>
                    <SpriteSection 
                        title={"Default"} 
                        front_url={sprites?.front_default} 
                        back_url={sprites?.back_default}
                    />
                    <SpriteSection 
                        title={"Female"} 
                        front_url={sprites?.front_female} 
                        back_url={sprites?.back_female}
                    />
                    <SpriteSection 
                        title={"Shiny"} 
                        front_url={sprites?.front_shiny} 
                        back_url={sprites?.back_shiny}
                    />
                    <SpriteSection 
                        title={"Shiny Female"} 
                        front_url={sprites?.front_shiny_female} 
                        back_url={sprites?.back_shiny_female}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}