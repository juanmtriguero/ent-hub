import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, AlertButton, PlatformColor, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

const posterPlaceholder = require('@/assets/images/poster.png');

export type Screen = {
    backdropUrl: string,
    description: string,
    genres: string[],
    originalTitle: string,
    posterUrl: string,
    releaseYear: string,
    title: string,
};

type Props = {
    buildScreen: (item: any) => Screen,
    fetchData: (id: string) => Promise<any>,
    id: string,
    statusOptions: any[],
};

export default function Screen({ buildScreen, fetchData, id, statusOptions }: Props) {

    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ screen, setScreen ] = useState<Screen | null>(null);
    const { height, width } = useWindowDimensions();
    const styles = getStyles(width, height);

    // FIXME: Store and retrieve
    const [ status, setStatus ] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        fetchData(id)
        .then(data => {
            setScreen(buildScreen(data));
        })
        .catch(error => {
            console.error(error);
            setScreen(null);
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

    if (!screen) {
        return (
            <View style={styles.centered}>
                <Text style={styles.centeredText}>There was an error loading the details, please try again later</Text>
            </View>
        );
    }

    const selectedStatus = status ? statusOptions.find(option => option.value === status) : 
        { label: 'Not saved', value: null, icon: 'nosign', color: PlatformColor('systemGray') };

    const selectStatus = () => {
        const buttons: AlertButton[] = [ { text: 'Cancel', style: 'cancel' } ];
        if (status) {
            buttons.push({ text: 'Remove', onPress: () => setStatus(null), style: 'destructive' });
        }
        statusOptions.forEach(option => {
            if (option.value !== status) {
                buttons.push({ text: option.label, onPress: () => setStatus(option.value) });
            }
        });
        Alert.alert('Status', '', buttons);
    };

    return (
        <ScrollView>
            <Image source={screen.backdropUrl} style={styles.backdrop} contentFit="cover" />
            <View style={styles.posterContainer}>
                <Image source={screen.posterUrl} style={styles.poster} contentFit="cover" placeholder={posterPlaceholder} placeholderContentFit="cover" />
            </View>
            <Pressable style={{ ...styles.statusButton, backgroundColor: selectedStatus.color }} onPress={selectStatus}>
                <SymbolView name={selectedStatus.icon} size={16} tintColor="white" />
                <Text style={styles.status}>{selectedStatus.label}</Text>
            </Pressable>
            <View style={styles.content}>
                <Text style={styles.title}>{screen.title}</Text>
                <Text style={styles.subtitle}>{screen.originalTitle} ({screen.releaseYear})</Text>
                <Text style={styles.description}>{screen.description}</Text>
                <View style={styles.tags}>
                    {screen.genres.map((genre) => <Text key={genre} style={styles.tag}>{genre}</Text>)}
                </View>
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
        marginBottom: width / 2,
        top: width / 5,
    },
    description: {
        fontSize: 16,
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
