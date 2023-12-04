// Tipo para definir las direcciones de ordenamiento posibles: ascendente o descendente.
export type Order = 'asc' | 'desc';

export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    // Compara los valores y retorna -1, 1, o 0 según la comparación.
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

export function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// Función para ordenar un array de forma estable, manteniendo el orden relativo de elementos iguales.

export function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    // Mapea cada elemento a un par [elemento, índice] para mantener la estabilidad.
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);

    // Ordena el array basándose en la función comparadora.
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    // Retorna el array ordenado, extrayendo solo los elementos (sin índices).
    return stabilizedThis.map((el) => el[0]);
}