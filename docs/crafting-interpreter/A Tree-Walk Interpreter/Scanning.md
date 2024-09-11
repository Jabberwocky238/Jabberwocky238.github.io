The first step is scanning, also known as lexing, or (if you’re trying to impress someone) lexical analysis. They all mean pretty much the same thing. I like “lexing” because it sounds like something an evil supervillain would do, but I’ll use “scanning” because it seems to be marginally more commonplace.
第一步是扫描，也被叫做分词，或者(如果你想要震惊某些人)也可以叫做词法分析。他们其实都一个意思。我喜欢分词，是因为听起来像是超级反派会做的事，但我会用扫描，因为它看上去稍显平凡。

A scanner (or lexer) takes in the linear stream of characters and chunks them together into a series of something more akin to “words”. In programming languages, each of these words is called a token. Some tokens are single characters, like ( and ,. Others may be several characters long, like numbers (123), string literals ("hi!"), and identifiers (min).
一个扫描器(分词器)接受线性字符流，然后把他们分组成一系列更像单词的东西。在编程语言中，这些词被叫做token。一些token是单独的字符，像&，其他的可能几个字符长，像数字，字符串字面量，标志符。
“Lexical” comes from the Greek root “lex”, meaning “word”.

Some characters in a source file don’t actually mean anything. Whitespace is often insignificant, and comments, by definition, are ignored by the language. The scanner usually discards these, leaving a clean sequence of meaningful tokens
一些源码中的字符并没有任何意义。空格经常是不重要的，还有在定义上注释也会被语言所忽略。扫描器会抛弃这些留下了干净的，有意义的token序列。