import { Application } from '@pixi/app';
import { Ticker } from '@pixi/ticker';
import { IEventDispatcher } from '../core/events/IEventDispatcher';
import { ILinkEventTracker } from '../core/events/ILinkEventTracker';
import { IWorkerEventTracker } from '../core/events/IWorkerEventTracker';
import { INitroCore } from '../core/INitroCore';
import { NitroTimer } from '../core/utils/NitroTimer';
import { IRoomManager } from '../room/IRoomManager';
import { IAvatarRenderManager } from './avatar/IAvatarRenderManager';
import { IRoomCameraWidgetManager } from './camera/IRoomCameraWidgetManager';
import { INitroCommunicationManager } from './communication/INitroCommunicationManager';
import { INitroLocalizationManager } from './localization/INitroLocalizationManager';
import { IRoomEngine } from './room/IRoomEngine';
import { IRoomSessionManager } from './session/IRoomSessionManager';
import { ISessionDataManager } from './session/ISessionDataManager';
import { ISoundManager } from './sound/ISoundManager';


export interface INitro extends Application
{
    init(): void;
    dispose(): void;
    getConfiguration<T>(key: string, value?: T): T;
    getLocalization(key: string): string;
    getLocalizationWithParameter(key: string, parameter: string, replacement: string): string;
    getLocalizationWithParameters(key: string, parameters: string[], replacements: string[]): string;
    addWorkerEventTracker(tracker: IWorkerEventTracker): void;
    removeWorkerEventTracker(tracker: IWorkerEventTracker): void;
    createWorkerEvent(message: { [index: string]: any }): void;
    sendWorkerEvent(message: { [index: string]: any }): void;
    addLinkEventTracker(tracker: ILinkEventTracker): void;
    removeLinkEventTracker(tracker: ILinkEventTracker): void;
    createLinkEvent(link: string): void;
    setWorker(val: Worker): void;
    nitroTimer: NitroTimer;
    core: INitroCore;
    events: IEventDispatcher;
    localization: INitroLocalizationManager;
    communication: INitroCommunicationManager;
    avatar: IAvatarRenderManager;
    roomEngine: IRoomEngine;
    sessionDataManager: ISessionDataManager;
    roomSessionManager: IRoomSessionManager;
    roomManager: IRoomManager;
    cameraManager: IRoomCameraWidgetManager;
    soundManager: ISoundManager;
    width: number;
    height: number;
    ticker: Ticker;
    time: number;
    isReady: boolean;
    isDisposed: boolean;
}
