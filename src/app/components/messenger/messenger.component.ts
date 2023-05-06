import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HasElementRef } from '@angular/material/core/common-behaviors/color';
import { combineLatest, map, of, switchMap, tap } from 'rxjs';
import { User } from 'src/app/models';
import { MessengerService } from 'src/app/services/messenger.service';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-messenger',
    templateUrl: './messenger.component.html',
    styleUrls: ['./messenger.component.css']
})
export class MessengerComponent implements OnInit {
    @ViewChild('endOfChat') endOfChat!: ElementRef;

    searchForm = new FormControl('');
    chatForm = new FormControl('');
    messageForm = new FormControl('');

    currentUser$ = this.userService.currentUser$;
    users$ = this.userService.users$;
    chats$ = this.messengerService.chats$;
    selectedChat$ = combineLatest([
        this.chatForm.valueChanges,
        this.chats$
    ]).pipe(map(([value, chats]) => chats.find(chat => chat.id === value[0])));
    messages$ = this.chatForm.valueChanges.pipe(
        map(value => value[0]),
        switchMap(chatId => this.messengerService.getMessages$(chatId)),
        tap(() => this.scrollDown())
    );

    constructor(
        private userService: UserService,
        private messengerService: MessengerService
    ) { }

    ngOnInit(): void {
        this.userService.users$;
    }

    openChat(user: User): void {
        this.messengerService.checkExistingChat(user?.uid).pipe(
            switchMap(chatId => {
                return chatId ? of(chatId) : this.messengerService.openChat(user);
            })
        ).subscribe(chatId => {
            this.chatForm.setValue([chatId]);
        });
    }

    sendMessage(): void {
        const message = this.messageForm.value;
        const selectedChatId = this.chatForm.value[0];

        if (message && selectedChatId) {
            this.messengerService.sendMessage(selectedChatId, message)
                .subscribe(() => this.scrollDown());
            this.messageForm.setValue('');
        }
    }

    scrollDown(): void {
        setTimeout(() => {
            if (this.endOfChat) {
                this.endOfChat.nativeElement.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    }
}
