function getSimpleType(type) {
    switch (type) {
    case 'ExportDefaultSpecifier':
        return 'default';
    default:
        return 'named';
    }
}

module.exports = (declarations, resolve) => {
    const exps = [];

    declarations.forEach(node => {
        const specifiers = node.specifiers || [];

        specifiers.forEach(specifier => {
            exps.push({
                type: getSimpleType(specifier.type),
                name: specifier.local.name,
                exportedName: (specifier.exported || specifier.local).name,
            });
        });
    });

    return exps;
};
