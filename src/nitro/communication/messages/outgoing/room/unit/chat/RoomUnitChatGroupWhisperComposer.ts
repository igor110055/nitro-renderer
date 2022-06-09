import { IMessageComposer } from '../../../../../../../core/communication/messages/IMessageComposer';

export class RoomUnitChatGroupWhisperComposer implements IMessageComposer<[ string ]>
{
    private _data: [ string ];

    constructor(recipientName: string)
    {
        this._data = [ recipientName ];
    }

    public getMessageArray()
    {
        return this._data;
    }

    public dispose(): void
    {
        return;
    }
}
