import {PathLike} from "fs";
import {createFsFromVolume, Volume} from "memfs";

import {promisify} from "../../util.promisify";
import {WriteFileOptions} from "../../fs-write-model";
import {StoreFs} from "../../model";
import {Model as WriteFileAtomicModel, writeFileAtomic} from "../../write-file-atomic/index";

export function volume(volumeOptions?: {
    writeFileAtomicOptions: WriteFileAtomicModel.WriteFileAtomicOptions;
}): StoreFs {
    const vol = new Volume();
    const impl = createFsFromVolume(vol);

    return {
        impl,
        chmod: promisify(impl.chmod),
        chown: promisify(impl.chown),
        mkdir: promisify(impl.mkdir),
        open: promisify(impl.open),
        close: promisify(impl.close),
        fsync: promisify(impl.fsync),
        readFile: promisify(impl.readFile),
        realpath: promisify(impl.realpath),
        rename: promisify(impl.rename),
        stat: promisify(impl.stat),
        writeFile: promisify(impl.writeFile),
        writeFileAtomic(path: PathLike /*| number*/, data: any, writeFileOptions?: WriteFileOptions): Promise<void> {
            return writeFileAtomic(impl, path, data, writeFileOptions, volumeOptions && volumeOptions.writeFileAtomicOptions);
        },
        unlink: promisify(impl.unlink),
    };
}

export const fs: StoreFs = volume();
