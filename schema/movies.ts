import { Realm } from '@realm/react';

export class Movie extends Realm.Object {
    id: string;
    status: string;

    constructor(realm: Realm, data: any) {
        super(realm, data);
        this.id = data.id;
        this.status = data.status;
    }

    static schema = {
        name: 'Movie',
        primaryKey: 'id',
        properties: {
            id: 'string',
            status: 'string',
        },
    };
}
