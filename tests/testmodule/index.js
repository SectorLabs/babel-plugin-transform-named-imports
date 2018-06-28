import myFunc from './myFunc';
import { myOtherOtherFunc } from './reexport';
import * as things from './constants';
export { myInlineFunc as myInlineExport } from './reexport';

export {
    myFunc,
    myOtherOtherFunc as myOtherFunc,
    things as thangs,
};

export default () => console.log('default export');
