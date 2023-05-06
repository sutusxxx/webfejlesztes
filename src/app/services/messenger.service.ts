import { Injectable } from '@angular/core';
import { Firestore, Timestamp, addDoc, collection, collectionData, doc, orderBy, query, updateDoc, where } from '@angular/fire/firestore';
import { User } from '../models';
import { UserService } from './user.service';
import { Observable, concatMap, map, take } from 'rxjs';
import { IChat } from '../interfaces';
import { IMessage } from '../interfaces/message.interface';

@Injectable({
    providedIn: 'root'
})
export class MessengerService {

    constructor(
        private firestore: Firestore,
        private userService: UserService
    ) { }

    openChat(selectedUser: User): Observable<string> {
        const ref = collection(this.firestore, 'chats');
        return this.userService.currentUser$.pipe(
            take(1),
            concatMap(user => addDoc(ref, {
                userIds: [user?.uid, selectedUser?.uid],
                users: [{ displayName: user?.displayName ?? '' }, { displayName: selectedUser?.displayName ?? '' }]
            })),
            map(ref => ref.id)
        );
    }

    checkExistingChat(userId: string): Observable<string | null> {
        return this.chats$.pipe(
            take(1),
            map(chats => {
                for (let i = 0; i < chats.length; i++) {
                    if (chats[i].userIds.includes(userId)) {
                        return chats[i].id;
                    }
                }
                return null;
            })
        )
    }

    addChatName(userId: string, chats: IChat[]): IChat[] {
        chats.forEach(chat => {
            const index = chat.userIds.indexOf(userId) === 0 ? 1 : 0;
            const otherUser = chat.users[index];
            chat.chatName = otherUser.displayName;
        });
        return chats;
    }

    sendMessage(chatId: string, message: string): Observable<any> {
        const ref = collection(this.firestore, 'chats', chatId, 'messages');
        const chatRef = doc(this.firestore, 'chats', chatId);
        const date = Timestamp.fromDate(new Date());
        return this.userService.currentUser$.pipe(
            take(1),
            concatMap(user => addDoc(ref, {
                text: message,
                senderId: user?.uid,
                date: date
            })),
            concatMap(() => updateDoc(chatRef, { lastMessage: message, lastMessageDate: date }))
        )
    }

    getMessages$(chatId: string): Observable<IMessage[]> {
        const ref = collection(this.firestore, 'chats', chatId, 'messages');
        const queryAll = query(ref, orderBy('date', 'asc'));
        return collectionData(queryAll) as Observable<IMessage[]>
    }

    get chats$(): Observable<IChat[]> {
        const ref = collection(this.firestore, 'chats');
        return this.userService.currentUser$.pipe(
            concatMap(user => {
                if (!user?.uid) return [];

                const q = query(ref, where('userIds', 'array-contains', user.uid));
                return collectionData(q, { idField: 'id' }).pipe(
                    map(chats => this.addChatName(user.uid, chats as IChat[]))
                ) as Observable<IChat[]>
            })
        )
    }
}
