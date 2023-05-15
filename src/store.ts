import { create } from 'zustand';

import { devtools, persist } from 'zustand/middleware';

interface BearState {
  bears: number;
  increase: (by: number) => void;
}

type TInOut = 'in' | 'out';

interface IMsg {
  chatId: string;
  textMessage: string;
  inOut: TInOut;
  timestamp: number;
  idMessage: string;
}

interface IChat {
  chatId: string;
  phoneN: string;
  msgs: IMsg[];
}

interface ISrote {
  chats: IChat[];
  // test: IMsg[];
  addChat: (phoneN: string) => void;
  addSentMsg: (msg: IMsg) => void;
  addReceivedMsg: (msg: IMsg) => void;
  // addTest: (msg: IMsg) => void;
}

export const useChatStore = create<ISrote>()(
  devtools(
    persist(
      (set) => ({
        chats: [],
        // test: [],
        addChat: (phoneN: string) =>
          set((state) => ({
            chats: [...state.chats, { chatId: `${phoneN}@c.us`, phoneN, msgs: [] }],
          })),
        addSentMsg: (msg: IMsg) =>
          set((state) => ({
            chats: state.chats.map((chat) =>
              chat.chatId === msg.chatId
                ? {
                    ...chat,
                    msgs: [...chat.msgs, msg].sort((a, b) => a.timestamp - b.timestamp),
                  }
                : chat
            ),
          })),
        addReceivedMsg: (msg: IMsg) =>
          set((state) => ({
            chats: state.chats.map((chat) =>
              chat.chatId === msg.chatId
                ? {
                    ...chat,
                    msgs: [...chat.msgs, msg].sort((a, b) => a.timestamp - b.timestamp),
                  }
                : chat
            ),
          })),
        // addTest: (msg: IMsg) =>
        //   set((state) => ({
        //     test: [...state.test, msg],
        //   })),
      }),
      {
        name: 'greenapi-storage',
      }
    )
  )
);

//.sort((a, b) => a.timestamp - b.timestamp)
