import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect } from "react";
import { FlatList, Pressable, RefreshControl, SafeAreaView, StatusBar, StyleSheet, Text, useColorScheme, View } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { useAppDispatch, useAppSelector } from "../state/rootStore";
import { fetchPokedexEntries, PokedexEntry, refreshPokedexEntries, selectPokedexEntries } from "../state/pokedexSlice";

export function PokedexScreen(): React.JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';
    const styles = StyleSheet.create({
        background: {
            flex: 1,
            backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
        },
        list: {
            flex: 1
        },
        listItem: {
            margin: 5,
            width: '100%'
        },
        listItemText: {
            fontSize: 40,
            color: isDarkMode ? Colors.lighter: Colors.darker
        }
    });

    const appDispatch = useAppDispatch()
    const { limit, offset, hasMore, loading } = useAppSelector((state) => state.pokedex)
    useEffect(() => {
        appDispatch(fetchPokedexEntries(limit, offset))
    }, [appDispatch])

    const navigation = useNavigation()

    const entries = useAppSelector((state) => selectPokedexEntries(state.pokedex))

    const Entry = (props: { entry: PokedexEntry }) => {
        const { entry : { name, url } } = props
        return (
            <View style={styles.listItem}>
                <Pressable onPress={() => {
                    //@ts-ignore
                    navigation.navigate('Pokemon', {url})
                }}>
                    <Text style={styles.listItemText}>{name}</Text>
                </Pressable>
            </View>
        )
    }

    const loadMore = useCallback(() => {
        console.debug('loadMore')
        if (loading === 'idle' && hasMore) {
            appDispatch(fetchPokedexEntries(limit, offset))
        } else {
            console.debug(`skipping loadMore: ${loading} ${hasMore}`)
        }
    }, [appDispatch, loading, hasMore, limit, offset])

    const refresh = useCallback(() => {
        appDispatch(refreshPokedexEntries())
    }, [appDispatch])

    return (
        <SafeAreaView style={styles.background}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={styles.background.backgroundColor}
            />
            <FlatList
                data={entries}
                renderItem={({item}) => <Entry entry={item}/>}
                keyExtractor={entry => entry.name}
                onEndReached={loadMore}
                onEndReachedThreshold={0.75}
                refreshControl={
                    <RefreshControl refreshing={false} onRefresh={refresh} />
                }
            />
        </SafeAreaView>
    );
}