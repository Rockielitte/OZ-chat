import { stat } from "fs";
import { create } from "zustand";
interface Iprops {
  onlineUsers: string[];
  setOnlineUsers: (data: string[], action: string) => void;
}
const useOnlineUsers = create<Iprops>()((set) => ({
  onlineUsers: [],
  setOnlineUsers: (data, action) =>
    set((state) => {
      switch (action) {
        case "RESET": {
          return { onlineUsers: [...data] };
        }
        case "ADD": {
          return { onlineUsers: [...state.onlineUsers, ...data] };
        }
        case "REMOVE": {
          const index = state.onlineUsers.indexOf(data[0]);
          if (index > -1) {
            const array = [...state.onlineUsers];
            array.splice(index, 1);
            return { onlineUsers: array };
          }
          return state;
        }
        default:
          return state;
      }
    }),
}));
export default useOnlineUsers;
