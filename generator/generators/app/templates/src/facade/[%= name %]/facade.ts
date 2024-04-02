import { [%= name %]Service } from "../../services";
import { I[%= name %]Facade } from "./interface";


/**
 * @export
 * @implements {I[%= name %]ModelService}
 */
const [%= name %]Facade: I[%= name %]Facade = {
    /**
     * @returns {Promise < any[] >}
     * @memberof [%= name %]Facade
     */
    async findAll(): Promise<any[]> {

        let [%= name %] = await [%= name %]Service.findAll();
        return [%= name %];
    }
}

export default [%= name %]Facade;