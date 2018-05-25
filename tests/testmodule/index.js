import myFunc from './myFunc';
import { myOtherOtherFunc } from './reexport';
import * as things from './constants';
export {Foo2} from './stuff';
// import {Foo2} from './stuff';

export {
    // Foo2,
    myFunc,
    myOtherOtherFunc as myOtherFunc,
    things as thangs,
};

export default () => console.log('default export');
