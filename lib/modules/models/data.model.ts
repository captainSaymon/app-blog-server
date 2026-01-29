import { Document } from 'mongoose';

export interface IData extends Document {
   title: string;
   text: string;
   image: string;
   likes: number;
}

export type Query<T> = {
   [key: string]: T;
};