import { BaseTexture, Resource, Texture } from '@pixi/core';
import { Loader, LoaderResource } from '@pixi/loaders';
import { Spritesheet } from '@pixi/spritesheet';
import { IGraphicAsset } from '../../room';
import { GraphicAssetCollection } from '../../room/object/visualization/utils/GraphicAssetCollection';
import { IGraphicAssetCollection } from '../../room/object/visualization/utils/IGraphicAssetCollection';
import { Disposable } from '../common/disposable/Disposable';
import { INitroLogger } from '../common/logger/INitroLogger';
import { NitroLogger } from '../common/logger/NitroLogger';
import { IAssetManager } from './IAssetManager';
import { IAssetData } from './interfaces';
import { NitroBundle } from './NitroBundle';

export class AssetManager extends Disposable implements IAssetManager
{
    private _logger: INitroLogger;
    private _textures: Map<string, Texture<Resource>>;
    private _collections: Map<string, IGraphicAssetCollection>;

    constructor()
    {
        super();

        this._logger = new NitroLogger(this.constructor.name);
        this._textures = new Map();
        this._collections = new Map();
    }

    public static removeFileExtension(name: string): string
    {
        return (name.substring(0, name.lastIndexOf('.')) || name);
    }

    public getTexture(name: string): Texture<Resource>
    {
        if(!name) return null;

        const existing = this._textures.get(name);

        if(!existing) return null;

        return existing;
    }

    public setTexture(name: string, texture: Texture<Resource>): void
    {
        if(!name || !texture) return;

        this._textures.set(name, texture);
    }

    public getAsset(name: string): IGraphicAsset
    {
        if(!name) return null;

        for(const collection of this._collections.values())
        {
            if(!collection) continue;

            const existing = collection.getAsset(name);

            if(!existing) continue;

            return existing;
        }

        return null;
    }

    public getCollection(name: string): IGraphicAssetCollection
    {
        if(!name) return null;

        const existing = this._collections.get(name);

        if(!existing) return null;

        return existing;
    }

    public createCollection(data: IAssetData, spritesheet: Spritesheet): IGraphicAssetCollection
    {
        if(!data) return null;

        const collection = new GraphicAssetCollection(data, spritesheet);

        if(collection)
        {
            for(const [ name, texture ] of collection.textures.entries()) this.setTexture(name, texture);

            this._collections.set(collection.name, collection);
        }

        return collection;
    }

    public downloadAsset(assetUrl: string, cb: (status: boolean) => void): void
    {
        this.downloadAssets([ assetUrl ], cb);
    }

    public downloadAssets(assetUrls: string[], cb: (status: boolean) => void): void
    {
        if(!assetUrls || !assetUrls.length)
        {
            cb(true);

            return;
        }

        const loader = new Loader();

        for(const url of assetUrls)
        {
            if(!url) continue;

            loader
                .add({
                    url,
                    crossOrigin: 'anonymous',
                    xhrType: url.endsWith('.nitro') ? LoaderResource.XHR_RESPONSE_TYPE.BUFFER : LoaderResource.XHR_RESPONSE_TYPE.JSON
                });
        }

        let remaining = assetUrls.length;

        const onDownloaded = (status: boolean, url: string) =>
        {
            if(!status)
            {
                this._logger.error('Failed to download asset: ' + url);

                loader.destroy();

                cb(false);

                return;
            }

            remaining--;

            if(!remaining)
            {
                loader.destroy();

                cb(true);

                return;
            }
        };

        loader.load((loader, resources) =>
        {
            for(const key in resources)
            {
                const resource = resources[key];

                if(!resource || resource.error)
                {
                    onDownloaded(false, resource.url);

                    return;
                }

                if(resource.extension === 'nitro')
                {
                    const nitroBundle = new NitroBundle(resource.data);

                    this.processAsset(nitroBundle.baseTexture, (nitroBundle.jsonFile as IAssetData), status =>
                    {
                        onDownloaded(true, resource.url);
                    });

                    continue;
                }

                if(resource.type === LoaderResource.TYPE.IMAGE)
                {
                    if(resource.texture) this.setTexture(resource.name, resource.texture);

                    onDownloaded(true, resource.url);

                    continue;
                }
            }
        });
    }

    private processAsset(baseTexture: BaseTexture, data: IAssetData, onDownloaded: (status: boolean) => void): void
    {
        const spritesheetData = data.spritesheet;

        if(spritesheetData && Object.keys(spritesheetData).length)
        {
            const spritesheet = new Spritesheet(baseTexture, spritesheetData);

            spritesheet.parse(() =>
            {
                this.createCollection(data, spritesheet);

                onDownloaded(true);
            });

            return;
        }

        this.createCollection(data, null);

        onDownloaded(true);
    }

    public get collections(): Map<string, IGraphicAssetCollection>
    {
        return this._collections;
    }
}
