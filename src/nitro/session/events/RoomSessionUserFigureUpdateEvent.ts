import { IRoomSession } from '../IRoomSession';
import { RoomSessionEvent } from './RoomSessionEvent';

export class RoomSessionUserFigureUpdateEvent extends RoomSessionEvent
{
    public static USER_FIGURE: string = 'RSUBE_FIGURE';

     private _roomIndex: number = 0;
    private _userId: number = 0;
    private _figure: string = '';
    private _gender: string = '';
    private _customInfo: string = '';
    private _achievementScore: number;
    private _banner: string = '';

    constructor(session: IRoomSession, roomIndex: number, userId: number, figure: string, gender: string, customInfo: string, achievementScore: number, banner: string)
    {
        super(RoomSessionUserFigureUpdateEvent.USER_FIGURE, session);

        this._userId = userId;
        this._figure = figure;
        this._gender = gender;
        this._customInfo = customInfo;
        this._achievementScore = achievementScore;
        this._banner = banner;
    }
  public get roomIndex(): number
    {
        return this._roomIndex;
    }

    public get userId(): number
    {
        return this._userId;
    }

    public get figure(): string
    {
        return this._figure;
    }

    public get gender(): string
    {
        return this._gender;
    }

    public get customInfo(): string
    {
        return this._customInfo;
    }

    public get activityPoints(): number
    {
        return this._achievementScore;
    }
    
    public get banner(): string
    {
        return this._banner;
    }
}
