import { useMemo } from 'react';

export type DataItem = { [key: string]: any };

export interface RowData extends DataItem {
    id: number;
}

const useDataNormalize = (
    attributes: string[],
    filterKeys: string[],
    inputData: DataItem[]
) => {
    /**
      * Creates a base object with all keys defined in attributes and initializes their values to null.
      * @param attributes An array of strings that define the keys of the base object.
      * @returns A base object with keys initialized to null.
      */
    const createBaseObject = (attributes: string[]): DataItem => {
        const baseObj: DataItem = {};
        attributes.forEach(attr => {
            baseObj[attr] = null;
        });
        return baseObj;
    };

    
    /**
     * Verifies that each key filter is present in at least one input object.
     * @param inputData The input objects.
     * @param filterKeys The keys to filter.
     */
    const validateFilterKeys = (inputData: DataItem[], filterKeys: string[]) => {
        const availableKeys = inputData.length > 0 ? Object.keys(inputData[0]) : [];
        filterKeys.forEach(key => {
            if (!availableKeys.includes(key)) {
                throw new Error(`The filter key '${key}' does not match any key in the input objects.`);
            }
        });
    };

    /**
     * Extracts values from a given object based on a set of keys.
     * @param item The object from which values will be extracted.
     * @param keys An array of keys to determine which values to extract from the object.
     * @returns An array of values extracted from the object.
     */
    const extractValues = (item: DataItem, keys: string[]): any[] => {
        return keys.map(key => item[key]);
    };

    /**
     * Transforms an array of input objects into an array of objects with a defined structure.
     * The structure is defined in attributes, and the values are extracted based on filterKeys.
     * @param inputData An array of objects to be transformed.
     * @param baseObject An object that defines the base structure for the transformation.
     * @param filterKeys Keys used to extract values from the input objects.
     * @returns An array of transformed objects.
     */
    const transformData = (
        inputData: DataItem[],
        baseObject: DataItem,
        filterKeys: string[]
    ): DataItem[] => {
        validateFilterKeys(inputData, filterKeys);
        return inputData.map(item => {
            const values = extractValues(item, filterKeys);
            const transformedItem: DataItem = { ...baseObject };
            attributes.forEach((attr, index) => {
                transformedItem[attr] = values[index];
            });
            return transformedItem;
        });
    };

    /**
      * useMemo is used to memorize the result of transformData, avoiding unnecessary calculations.
      * It is only recalculated when attributes, filterKeys, or inputData change.
      */
    const transformedData = useMemo(() => {
        const baseObject = createBaseObject(attributes);
        return transformData(inputData, baseObject, filterKeys);
    }, [attributes, filterKeys, inputData]);

    return transformedData;
};

export default useDataNormalize;