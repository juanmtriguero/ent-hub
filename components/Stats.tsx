import { Status } from '@/components/Screen';
import { SavedItem } from '@/models/interfaces';
import { Realm, useQuery, useRealm } from '@realm/react';
import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { SFSymbol, SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, PlatformColor, ActivityIndicator } from 'react-native';

type Props = {
    schema: Realm.ObjectClass<SavedItem & Realm.Object>,
    statusOptions: Status[],
};

export default function Stats({ schema, statusOptions }: Props) {

    const items = useQuery(schema);
    const realm = useRealm();
    const [ importInProgress, setImportInProgress ] = useState(false);
    const [ exportInProgress, setExportInProgress ] = useState(false);

    const renderStat = ({ item }: { item: Status }) => {
        const count = items.filtered(`status == $0`, item.value).length;
        return (
            <View style={styles.statRow}>
                <View style={styles.statLabel}>
                    <SymbolView name={item.icon} size={16} tintColor={item.color} />
                    <Text style={{ ...styles.stat, color: item.color }}>{item.label}</Text>
                </View>
                <Text style={styles.stat}>{count}</Text>
            </View>
        );
    };

    const importItems = () => {
        setImportInProgress(true);
        DocumentPicker.getDocumentAsync({ type: 'application/json' })
        .then(({ assets }) => {
            if (assets?.length) {
                const file = new File(assets[0].uri);
                const items = JSON.parse(file.textSync());
                realm.write(() => {
                    items.forEach((item: SavedItem) => {
                        realm.create(schema, item, Realm.UpdateMode.Modified);
                    });
                });
                alert('The import has been completed successfully');
            }
        })
        .catch(error => {
            console.error(error);
            alert('There was an error during the import, please use a valid file');
        })
        .finally(() => {
            setImportInProgress(false);
        });
    };

    const exportItems = () => {
        setExportInProgress(true);
        try {
            const file = new File(Paths.cache, `${schema.name}_${Date.now()}.json`);
            file.create();
            file.write(JSON.stringify(items, (key, value) => (key === 'parent' ? undefined : value)));
            Sharing.shareAsync(file.uri);
        } catch (error) {
            console.error(error);
            alert('There was an error during the export, please try again');
        }
        setExportInProgress(false);
    };

    const action = (label: string, icon: SFSymbol, onPress: () => void, inProgress: boolean) => {
        if (inProgress) {
            return (
                <View style={styles.action}>
                    <ActivityIndicator size="large" />
                </View>
            );
        }
        return (
            <Pressable onPress={onPress} style={styles.action}>
                <SymbolView name={icon} size={35} />
                <Text style={styles.actionText}>{label}</Text>
            </Pressable>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My collection</Text>
            </View>
            <View style={styles.stats}>
                <FlatList data={statusOptions} renderItem={renderStat} />
            </View>
            <View style={styles.actions}>
                {action('Import', 'document.badge.plus', importItems, importInProgress)}
                {action('Export', 'document.badge.arrow.up', exportItems, exportInProgress)}
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    actions: {
        flexDirection: 'row',
        gap: 10,
        marginVertical: 10,
    },
    action: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 15,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
    },
    actionText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: PlatformColor('systemBlue'),
    },
    container: {
        margin: 10,
    },
    header: {
        margin: 10,
    },
    headerTitle: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    stat: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    statLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderColor: 'lightgray',
        marginBottom: 10,
    },
    stats: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: 'white',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'lightgray',
    },
});
