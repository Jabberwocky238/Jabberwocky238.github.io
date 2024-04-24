export type FolderItem = {
    uriName: string;
    isDir: boolean;
    urlPath: string[];
    items?: FolderItem[];
}

export function getRootUriStrcuture(result: FolderItem[]) {
    function flatten(array: FolderItem[]): FolderItem[] {
        return array.reduce((acc: FolderItem[], val) => {
            return val.isDir ? acc.concat(flatten(val.items!)) : acc.concat(val);
        }, []);
    }
    const flat = flatten(result)
    return flat
}

export function initReflexMap(result: FolderItem[]){
    const reflexMap = new Map<string, string[]>()
    const array = getRootUriStrcuture(result)
    for (let index = 0; index < array.length; index++) {
        reflexMap.set(array[index].uriName.toLowerCase().replaceAll(/ /g,'_'), array[index].urlPath)
    }
    return reflexMap
}