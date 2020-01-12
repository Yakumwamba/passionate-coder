import {
    TreeDataProvider,
    TreeItem,
    TreeItemCollapsibleState,
    Command,
    EventEmitter,
    Event,
    Disposable,
    TreeView,
    commands
} from "vscode";
import { KpmItem } from "./models";
import { KpmProviderManager, KpmTreeItem } from "./KpmProviderManager";

const kpmProviderMgr: KpmProviderManager = KpmProviderManager.getInstance();

export class KpmProvider implements TreeDataProvider<KpmItem> {
    private _onDidChangeTreeData: EventEmitter<
        KpmItem | undefined
    > = new EventEmitter<KpmItem | undefined>();

    readonly onDidChangeTreeData: Event<KpmItem | undefined> = this
        ._onDidChangeTreeData.event;

    private view: TreeView<KpmItem>;

    constructor() {
        //
    }

    bindView(kpmTreeView: TreeView<KpmItem>): void {
        this.view = kpmTreeView;
    }

    getParent(_p: KpmItem) {
        return void 0; // all playlists are in root
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    refreshParent(parent: KpmItem) {
        this._onDidChangeTreeData.fire(parent);
    }

    getTreeItem(p: KpmItem): KpmTreeItem {
        let treeItem: KpmTreeItem = createKpmTreeItem(
            p,
            TreeItemCollapsibleState.None
        );

        return treeItem;
    }

    async getChildren(element?: KpmItem): Promise<KpmItem[]> {
        let kpmItems: KpmItem[] = [];
        if (element) {
            // return the children of this element
        } else {
            // return the parent elements
            kpmItems = await kpmProviderMgr.getKpmTreeParents();
        }
        return kpmItems;
    }
}

/**
 * Create the playlist tree item (root or leaf)
 * @param p
 * @param cstate
 */
function createKpmTreeItem(p: KpmItem, cstate: TreeItemCollapsibleState) {
    return new KpmTreeItem(p, cstate);
}
