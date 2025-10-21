import { Item, SavedItem } from '@/models/interfaces';
import { Realm, useQuery, useRealm } from '@realm/react';
import { Image } from 'expo-image';
import { SFSymbol, SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, AlertButton, OpaqueColorValue, PlatformColor, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

const posterPlaceholder = require('@/assets/images/poster.png');

export type Status = {
    color: OpaqueColorValue,
    icon: SFSymbol,
    label: string,
    value: string,
};

type Props = {
    additionalContent: (item: Item & any, savedItem?: SavedItem & any) => React.ReactNode,
    buildItem: (data: any) => Item,
    fetchData: (id: string) => Promise<any>,
    id: string,
    schema: Realm.ObjectClass<SavedItem & Realm.Object>,
    statusOptions: Status[],
};

export default function Screen({ additionalContent, buildItem, fetchData, id, schema, statusOptions }: Props) {

    const savedItem = useQuery(schema).filtered('id == $0', id)[0];
    const realm = useRealm();
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ item, setItem ] = useState<Item | null>(null);
    const { height, width } = useWindowDimensions();
    const styles = getStyles(width, height);

    useEffect(() => {
        setIsLoading(true);
        fetchData(id)
        .then(data => {
            const item = buildItem(data);
            setItem(item);
            if (savedItem) {
                realm.write(() => {
                    realm.create(schema, item, Realm.UpdateMode.Modified);
                });
            }
        })
        .catch(error => {
            console.error(error);
            setItem(savedItem);
        })
        .finally(() => {
            setIsLoading(false);
        });
    }, [id]);

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!item) {
        return (
            <View style={styles.centered}>
                <Text style={styles.centeredText}>There was an error loading the details, please try again later</Text>
            </View>
        );
    }

    const selectedStatus: Status = statusOptions.find(option => option.value === savedItem?.status) ??
        { label: 'Not saved', value: '', icon: 'nosign', color: PlatformColor('systemGray') };

    const changeStatus = (status: string | null) => {
        realm.write(() => {
            if (status) {
                if (savedItem) {
                    savedItem.status = status;
                    savedItem.timestamp = Date.now();
                } else {
                    realm.create(schema, { ...item, status, timestamp: Date.now() }, Realm.UpdateMode.Modified);
                }
            } else {
                realm.delete(savedItem);
            }
        });
    };

    const selectStatus = () => {
        const buttons: AlertButton[] = [ { text: 'Cancel', style: 'cancel' } ];
        if (savedItem?.status) {
            buttons.push({ text: 'Remove', onPress: () => changeStatus(null), style: 'destructive' });
        }
        statusOptions.forEach(option => {
            if (option.value !== savedItem?.status) {
                buttons.push({ text: option.label, onPress: () => changeStatus(option.value) });
            }
        });
        Alert.alert('Status', '', buttons);
    };

    return (
        <ScrollView>
            <Image source={item.backdropUrl} style={styles.backdrop} contentFit="cover" />
            <View style={styles.posterContainer}>
                <Image source={item.posterUrl} style={styles.poster} contentFit="cover" placeholder={posterPlaceholder} placeholderContentFit="cover" />
            </View>
            <Pressable style={{ ...styles.statusButton, backgroundColor: selectedStatus.color }} onPress={selectStatus}>
                <SymbolView name={selectedStatus.icon} size={16} tintColor="white" />
                <Text style={styles.status}>{selectedStatus.label}</Text>
            </Pressable>
            <View style={styles.content}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.originalTitle} ({item.releaseYear})</Text>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.details}>{item.details}</Text>
                <View style={styles.tags}>
                    {item.genres.map((genre) => <Text key={genre.id} style={styles.tag}>{genre.name}</Text>)}
                </View>
                {additionalContent(item, savedItem)}
            </View>
        </ScrollView>
    );

}

const getStyles = (width: number, height: number) => StyleSheet.create({
    backdrop: {
        height: width * 0.6,
        backgroundColor: PlatformColor('systemGray3'),
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: width / 8,
        marginBottom: height / 8,
    },
    centeredText: {
        textAlign: 'center',
    },
    content: {
        flexDirection: 'column',
        gap: 10,
        marginHorizontal: 20,
        marginTop: 5,
        marginBottom: width * 0.45,
        top: width / 5,
    },
    description: {
        fontSize: 16,
    },
    details: {
        fontWeight: 'bold',
    },
    poster: {
        height: width * 0.6,
    },
    posterContainer: {
        width: width * 0.4,
        borderRadius: 15,
        borderWidth: 5,
        borderColor: PlatformColor('systemGroupedBackground'),
        overflow: 'hidden',
        position: 'absolute',
        top: width * 0.15,
        left: 20,
    },
    subtitle: {
        fontSize: 20,
        color: PlatformColor('secondaryLabel'),
    },
    statusButton: {
        position: 'absolute',
        top: width * 0.6,
        right: 10,
        margin: 10,
        padding: 10,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    status: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    tag: {
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 5,
        padding: 5,
        backgroundColor: 'white',
    },
    tags: {
        flexDirection: 'row',
        gap: 5,
        flexWrap: 'wrap',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 24,
    },
});
