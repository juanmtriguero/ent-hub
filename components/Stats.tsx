import { Status } from '@/components/Screen';
import { SavedItem } from '@/models/interfaces';
import { Realm, useQuery } from '@realm/react';
import { SymbolView } from 'expo-symbols';
import { View, Text, StyleSheet, FlatList } from 'react-native';

type Props = {
    schema: Realm.ObjectClass<SavedItem & Realm.Object>,
    statusOptions: Status[],
};

export default function Stats({ schema, statusOptions }: Props) {

    const items = useQuery(schema);

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

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Statistics</Text>
            </View>
            <View style={styles.stats}>
                <FlatList data={statusOptions} renderItem={renderStat} />
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
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