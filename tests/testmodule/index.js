import myFunc from './myFunc';
import { myOtherOtherFunc } from './reexport';
import * as things from './constants';
export { myInlineFunc as myInlineExport } from './reexport';
export { default as myDefaultFunc, myReexportedFunc } from './myFunc';

export {
    myFunc,
    myOtherOtherFunc as myOtherFunc,
    things as thangs,
};

export default () => console.log('default export');
