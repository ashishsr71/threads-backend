const { RoomServiceClient, Room}=require('livekit-server-sdk')


let roomService;

async function createRoom(){
    if(roomService){
        return roomService;
    }
    const livekitHost = 'https://my.livekit.host';
    roomService = new RoomServiceClient(livekitHost, 'api-key', 'secret-key');
    return roomService;
};




