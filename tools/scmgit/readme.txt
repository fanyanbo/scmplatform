
该程序是实现提交生成的文件到girret的功能。

该程序编译方法是：
g++ -o scmgit scmgit.cpp

编译好了之后，复制到 ~/bin 目录下：
cp -f scmgit ~/bin/

Node.js 在生成文件之后，会调用此程序去提交给girret，异步操作，不会造成前端卡顿.


