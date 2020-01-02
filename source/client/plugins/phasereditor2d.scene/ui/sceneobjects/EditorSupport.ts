namespace phasereditor2d.scene.ui.sceneobjects {

    import read = colibri.core.json.read;
    import write = colibri.core.json.write;
    import controls = colibri.ui.controls;

    export abstract class EditorSupport<T extends SceneObject> {

        private _extension: SceneObjectExtension;
        private _object: T;
        private _label: string;
        private _scene: GameScene;
        private _serializables: json.Serializable[];
        // tslint:disable-next-line:ban-types
        private _components: Map<Function, any>;

        constructor(extension: SceneObjectExtension, obj: T) {

            this._extension = extension;
            this._object = obj;
            this._serializables = [];
            this._components = new Map();
            this._object.setDataEnabled();
            this.setId(Phaser.Utils.String.UUID());
        }

        abstract getScreenBounds(camera: Phaser.Cameras.Scene2D.Camera);

        abstract getCellRenderer(): controls.viewers.ICellRenderer;

        // tslint:disable-next-line:ban-types
        getComponent(ctr: Function): any {
            return this._components.get(ctr) as T;
        }

        // tslint:disable-next-line:ban-types
        hasComponent(ctr: Function) {
            return this._components.has(ctr);
        }

        // tslint:disable-next-line:ban-types
        static getObjectComponent(obj: any, ctr: Function) {

            if (obj && typeof obj["getEditorSupport"] === "function") {

                const support = obj["getEditorSupport"]() as EditorSupport<any>;

                return support.getComponent(ctr) ?? null;
            }

            return null;
        }

        protected addComponent(...components: any[]) {

            for (const c of components) {

                this._components.set(c.constructor, c);
            }

            this._serializables.push(...components);
        }

        protected setNewId(sprite: sceneobjects.SceneObject) {
            this.setId(Phaser.Utils.String.UUID());
        }

        getExtension() {
            return this._extension;
        }

        getObject() {
            return this._object;
        }

        getId() {
            return this._object.name;
        }

        setId(id: string) {
            this._object.name = id;
        }

        getLabel() {
            return this._label;
        }

        setLabel(label: string) {
            this._label = label;
        }

        getScene() {
            return this._scene;
        }

        setScene(scene: GameScene) {
            this._scene = scene;
        }

        writeJSON(ser: json.Serializer) {

            ser.write("id", this.getId());
            ser.write("type", this._extension.getTypeName());
            ser.write("label", this._label);

            for (const s of this._serializables) {

                s.writeJSON(ser);
            }
        }

        readJSON(ser: json.Serializer) {

            this.setId(ser.read("id"));
            this._label = ser.read("label");

            for (const s of this._serializables) {

                s.readJSON(ser);
            }
        }
    }
}