import [%= name %]Service from './service';

/**
 * @export
 * @returns {Promise < any[] >}
 */
export async function findAll(): Promise < any[] > {
    return await [%= name %]Service.findAll();
}