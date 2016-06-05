/**
 * Created by May on 2016/6/5.
 */

// https://github.com/shelljs/shelljs
require('shelljs/global');

//  remove recursively, forced
rm('-rf', 'build/chrome');

//  make directory, with full path
mkdir('-p', 'build/chrome');

//  copy recursively, forced
cp('-rf', 'src/*', 'build/chrome');