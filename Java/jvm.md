---
prev: './index'
next: './index'
---

# JVM学习笔记(java1.8)

## 运行时数据区
运行时数据区 ==> [**方法区**(Method Area)，**虚拟机栈**(VM Stack)，**本地方法栈**(Native Method Stack)，**堆**(heap)，**程序计数器**(Program Counter Register)]
- 方法区和堆<==>由所有的线程共享
- 虚拟机栈，本地方法栈，程序计数器<==>线程隔离的数据区

### 程序计数器
- 较小的内存空间，当前线程所执行的字节码的行号指示器。
- 每个线程都有独立的程序计数器。
- 字节码解释器工作时就是通过改变这个计数器的值来选取下一条需要执行的字节码指令。
- 分支、循环、跳转、异常处理、线程恢复等基础功能都依赖程序计数器。

### Java虚拟机栈
- 线程私有，生命周期与线程相同
- 方法执行时，Java虚拟机会同步创建一个栈帧，用于存储局部变量表、操作数栈、动态连接、方法出口等信息。
- 线程请求的栈深度大于虚拟机所允许的深度，将抛出StackOverflowError异常。
- 栈扩展时无法申请到足够的内存，会抛出OutOfMemoryError异常。

### 本地方法栈
- 本地方法栈（Native Method Stacks）与虚拟机栈所发挥的作用是非常相似的，本地方法栈则为虚拟机使用到的本地（Native） 方法服务。
- 线程请求的栈深度大于虚拟机所允许的深度，将抛出StackOverflowError异常。
- 栈扩展时无法申请到足够的内存，会抛出OutOfMemoryError异常。

### Java堆
- 各个线程共享
- Java堆是垃圾收集器管理的内存区域
- Java世界里“几乎”所有的对象实例都在这里分配内存

### 方法区
- 各个线程共享
- 用于存储已被虚拟机加载的类型信息、常量、静态变量、即时编译器编译后的代码缓存等数据
- 方法区无法满足新的内存分配需求时，将抛出
OutOfMemoryError异常

### 运行时常量池
- 方法区的一部分
- 存放编译期生 成的各种字面量与符号引用，这部分内容将在类加载后存放到方法区的运行时常量池中。

### 直接内存（Direct Memory）
- 在JDK 1.4中新加入了NIO（New Input/Output）类，引入了一种基于通道（Channel）与缓冲区
（Buffer）的I/O方式，它可以使用Native函数库直接分配堆外内存，然后通过一个存储在Java堆里面的 DirectByteBuffer对象作为这块内存的引用进行操作

## 类加载器
JVM支持两种类型的类加载器，分别为**引导类加载器**(Bootstrap ClassLoader) 和**自定义类加载器**(User-Defined ClassLoader)
所有派生于抽象类ClassLoader的类加载器都划分为自定义类加载器

`Bootstrap Class Loader`(非java语言实现) <== `Extension Class Loader` <== `System Class Loader`<== `User Defined Class Loader`

```java
public class ClassLoaderTest {
    public static void main(String[] args) {
        //获取系统类加载器
        ClassLoader systemClassLoader = ClassLoader.getSystemClassLoader();
        System.out.println(systemClassLoader);//sun.misc.Launcher$AppClassLoader@4e0e2f2a

        //获取其上层：扩展类加载器
        ClassLoader extClassLoader = systemClassLoader.getParent();
        System.out.println(extClassLoader);//sun.misc.Launcher$ExtClassLoader@2a139a55

        //获取其上层：试图获取BootstrapClassLoader，就是它，但是获取不到
        ClassLoader bootstrapClassLoader = extClassLoader.getParent();
        System.out.println(bootstrapClassLoader);//null

        //用户自定义类：默认使用系统类加载器进行加载
        ClassLoader classLoader = ClassLoaderTest.class.getClassLoader();
        System.out.println(classLoader);//sun.misc.Launcher$AppClassLoader@4e0e2f2a

        //String类：获取不到引导类加载器 ==> 实际是使用BootstrapClassLoader进行加载
        ClassLoader stringClassLoader = String.class.getClassLoader();
        System.out.println(stringClassLoader); //null
    }
}
```

### 引导类加载器（Bootstrap ClassLoader）
- 这个类加载使用c/c++语言实现，嵌套在JVM内部。  
- 它用来加载Java的核心库（JAVA_HOME/jre/lib/[rt.jar、resource.java、sun.boot.class.path路径下的类容]），用于提供JVM自身需要的类。  
- 并不继承自java.lang.ClassLoader，没有父加载器。  
- 加载扩展类加载器和应用程序类加载器，并指定为他们的父类加载器。  
- 出于安全考虑，Bootstrap启动类加载器只加载包名为java、javax、sun等开头的类。  

### 扩展类加载器（Extension ClassLoader）
- Java语言编写，由sun.misc.Launcher$ExtClassLoader实现。
- 派生于ClassLoader类。
- 父类加载器为启动类加载器。
- 从java.ext.dirs系统属性所指定的目录中加载类库，或从jdk的安装目录的jre/lib/ext子目录（扩展目录）下加载类库。如果用户创建的jar放在此目录下，也会自动由扩展类加载器加载。

### 应用程序类加载器（系统类加载器，AppClassLoader）
- java语言编写，由sun.misc.Launcher$AppClassLoader实现
- 派生于ClassLoader类
- 父类加载器为扩展类加载器
- 它负责加载环境变量classpath或系统属性java.class.path指定路径下的类库
- **该类加载器是程序中默认的类加载器**，一般来说，Java应用的类都是由它来完成加载
- 通过ClassLoader#getSystemClassLoader()方法可以获取到该类加载器

```java
public class ClassLoaderTest1 {
    public static void main(String[] args) {
        System.out.println("============启动类加载器==============");
        URL[] urLs = Launcher.getBootstrapClassPath().getURLs();
        for (URL urL : urLs) {
            System.out.println(urL);
            //file:/D:/Development/java/jdk8u275-b01/jre/lib/resources.jar
            //file:/D:/Development/java/jdk8u275-b01/jre/lib/rt.jar
            //file:/D:/Development/java/jdk8u275-b01/jre/lib/sunrsasign.jar
            //file:/D:/Development/java/jdk8u275-b01/jre/lib/jsse.jar
            //file:/D:/Development/java/jdk8u275-b01/jre/lib/jce.jar
            //file:/D:/Development/java/jdk8u275-b01/jre/lib/charsets.jar
            //file:/D:/Development/java/jdk8u275-b01/jre/lib/jfr.jar
            //file:/D:/Development/java/jdk8u275-b01/jre/classes
        }
        //从上面的路径中随意选择一个jar包中的某个类查看他的类加载器
        ClassLoader voidClassLoader = Void.class.getClassLoader();
        System.out.println(voidClassLoader); //null

        System.out.println("===============扩展类加载器===============");
        String extDirs = System.getProperty("java.ext.dirs");
        for (String s : extDirs.split(";")) {
            System.out.println(s);
            //D:\Development\java\jdk8u275-b01\jre\lib\ext
            //C:\WINDOWS\Sun\Java\lib\ext
        }
        //从上面的路径中随意选择一个jar包中的某个类查看他的类加载器
        ClassLoader curveClassLoader = CurveDB.class.getClassLoader();
        System.out.println(curveClassLoader); //sun.misc.Launcher$ExtClassLoader@4e25154f
    }
}
```