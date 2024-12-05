---
authors: [jabberwocky238]
tags: 
    - en
    - tech
    - rust
description: Build tree data structrue from table, in Rust.
---

# Build tree from table in Rust

This `{ truncate }` is so fucking ugly...

{/* truncate */}

## Motivation
I have a project named [Jobs](https://github.com/jabberwocky238/Jobs).

The duty of this app, maybe is scanning and calculating disk and folders' size. In this process, store the node of files and directories. Therefore we can reuse the nodes to speed up next round of scanning.

## Persistent storage

Obviously, I need to find a good way to persist my data to disk.

### Why I dont use JSON
At first, I choose JSON, because of its straightforward tree structure. But then I found out that I could be tied up by it.

When I want to save a subdirectory, I have to start from the root and traverse the tree, deep down below until I find the target. This is not efficient and robust.

What's more, I will add an additional feature to this app in the future. The most possible one is **trie search**, which cannot create a good synergy with JSON. Because the insert and delete of trie is not as easy as you think.

### CSV
Before I fall on CSV, I have tried Graph Database, which can maintain the tree structure of my idea before.

But then I found out the complexity is definitely too high for me to have a good control of the whole project.

Then I turn around to try sqlite, but there is such a apparent thing to wake me up:

*Sqlite is a relational database. So why don't I just use a csv file instead?*

So I choose CSV afterward.

## Come to the point
Relational database has a table structure. So the problem here has turning into **"How to turn a table to a tree and vice versa"**.

### serialize
First, let talk about serialize, aka turning a tree to a table.

```
child_hash, parent_hash, details...
```

And everything else is the same as sql`JOIN`.

Easy, hah?

### deserialize

Now let's talk about deserialize, aka turning a table to a tree.

The first idea coming into my mind is build tree in a top-down way. Create the root node first, then its children.

What follows is the very strengent regulation of Rust's mutation and ownership. If the root create at first, then it must be mutable. Because we need to add children to it. But for the subtree, which can be called "subroot", they also need to be mutable. But the implementation confronts the double use of the same mutable reference.

```rust
pub fn deserialize() -> Result<DirInfo, Box<dyn Error>> {
    for row in data.iter() {
        let mut subroot: DirInfo = row.into();
        let mut parent = data.find_parent(subroot); // illegal
        // parent need to be change, but it still in data
        // data itself is borrowed by for loop.
        // so we can't take mutable parent out of it.
        parent.insert(subroot);
    }
    Ok(root)
}
```       

OK, after that, I have tried many different ways, such as maintaining an additional symbol table, hashmap, clone, vector, drain / reduce / rev, etc...

None of them can solve this elegantly.
<details>
  <summary>evil reduce function😲😲😲😲😲</summary>

Here is a interesting issue that I want to talk about:

Rust's iterator have a function called `reduce`, which literally means reduce the whole vector into a single element. And this is exactly what I want.

My assumption is like:
```rust
let root = data.iter().reduce(|array, element| {
    array.find_parent(element).insert(element);
    array
});
```
Is that extremely nice? How smart I am!

Fuck!

`reduce` have two paramters, the first one is element, the second one is also the fucking element!
```rust
let root = data.iter().reduce(|a, b| {
    a + b // how stupid it is!
});
```
It is different with javascript!

```javascript
let root = data.reduce((prev, cur, index, arr) => {
    arr.find_parent(element).insert(element);
    return array;
});
```
</details>

After all, I came out a solution, which is a bottom-up way. Create the leaf node first, then its parent.

`DumpData` is csv format, `Node` is tree format.

```rust
let mut symbols: HashMap<u64, Node> = HashMap::new();
let data = rdr.deserialize().collect::<Vec<DumpData>>();
    
for dumpdata in data.iter() {
    // make sure child node exists
    // it will return '$mut Node', but we don't want the ref, but the pure value.
    symbols.entry(dumpdata.chash).or_insert_with(|| dumpdata.to_node()); 
    // take child out
    let child_node: Node = symbols.remove(&dumpdata.chash).unwrap(); 
}
```

In this way, we can make sure the child node is completely owned by loop. And it can be removed after adding into parent.

What about the parent node? We can't remove it from the data, because it is still in the loop. So we need to find it in the `data` again.

```rust
for dumpdata in data.iter() {
    ...
    // make sure parent node exists, and unique
    let parent_node: $mut Node = symbols.entry(dumpdata.phash).or_insert_with(|| {
        data.iter().find(|d| d.chash == dumpdata.phash).unwrap().to_node()
    });
    parent.children.insert(dumpdata.chash, child_node);
}
```

And the parent Node still stays in the `data`, so it can be used in the next loop.

full code below:
```rust
pub fn deserialize() -> Result<DirInfo, Box<dyn Error>> {
    // 获取用户的 HOME 目录
    let home_dir = env::var("HOME").or_else(|_| env::var("USERPROFILE"))?;
    // 创建 CSV 文件的完整路径
    let file_path = format!("{}/example.csv", home_dir);
    // 读取文件
    let file = File::open(&file_path)?;
    let mut rdr = Reader::from_reader(file);

    let mut symbols: HashMap<u64, JNode> = HashMap::new();
    let mut root: Option<JNode> = None;
    let data = rdr
        .deserialize()
        .map(|result| result.unwrap())
        .collect::<Vec<DumpData>>()
        .into_iter()
        .rev()
        .collect::<Vec<DumpData>>();

    for dumpdata in data.iter() {
        symbols
            .entry(dumpdata.chash)
            .or_insert_with(|| dumpdata.to_node());
        let child_node = symbols.remove(&dumpdata.chash).unwrap();

        if dumpdata.phash == 0 {
            root = Some(child_node);
            continue;
        }

        let parent_node = symbols.entry(dumpdata.phash).or_insert_with(|| {
            data.iter()
                .find(|d| d.chash == dumpdata.phash)
                .unwrap()
                .to_node()
        });
        if let JNode::DirInfo(parent) = parent_node {
            parent.children.insert(dumpdata.chash, child_node);
        }
    }
    match root {
        Some(JNode::DirInfo(root)) => Ok(root),
        _ => Err("Fail to deserialize".into()),
    }
}
```

*Ah...The second blog...*