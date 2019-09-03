import { Injectable } from '@nestjs/common';
import { Cat } from './interface/cat.interface';
import producer from '../kafka/producer';
import consumer from '../kafka/consumer';

@Injectable()
export class CatsService {

    private readonly cats: Cat[] = [];

    create(cat: Cat) {
        this.cats.push(cat);
    }

    findAll(): Cat[] {
        return this.cats;
    }

    sendToKafkaMessage(objData, cb): void {
        // console.log(2);
        const partition = Date.now() % 2 === 0 ? 0 : 1;

        const buffer = Buffer.from(JSON.stringify(objData) + '_' + partition);

        const record = [{
            topic: `topic`,
            messages: buffer,
            attributes: 1,
            key: `key_${partition}`,
        }];

        console.info(`[record]:==:>${JSON.stringify(record)}`);

        producer.send(record, cb);

    }

    consumerFromKafkaMessage() {
        consumer.on('message', (message) => {
            console.log('success consumer from kafka message', message);
        });
    }

}
