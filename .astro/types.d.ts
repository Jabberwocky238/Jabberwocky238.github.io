declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"markdown": {
"conceptions/Attention.md": {
	id: "conceptions/Attention.md";
  slug: "conceptions/attention";
  body: string;
  collection: "markdown";
  data: any
} & { render(): Render[".md"] };
"conceptions/Continuous Batching.md": {
	id: "conceptions/Continuous Batching.md";
  slug: "conceptions/continuous-batching";
  body: string;
  collection: "markdown";
  data: any
} & { render(): Render[".md"] };
"conceptions/LLM Generate.md": {
	id: "conceptions/LLM Generate.md";
  slug: "conceptions/llm-generate";
  body: string;
  collection: "markdown";
  data: any
} & { render(): Render[".md"] };
"conceptions/MoE(Mixture-of-Experts).md": {
	id: "conceptions/MoE(Mixture-of-Experts).md";
  slug: "conceptions/moemixture-of-experts";
  body: string;
  collection: "markdown";
  data: any
} & { render(): Render[".md"] };
"conceptions/ORCA.md": {
	id: "conceptions/ORCA.md";
  slug: "conceptions/orca";
  body: string;
  collection: "markdown";
  data: any
} & { render(): Render[".md"] };
"conceptions/PEFT(Parameter-Efficient Fine-Tuning)/Adapter Tuning.md": {
	id: "conceptions/PEFT(Parameter-Efficient Fine-Tuning)/Adapter Tuning.md";
  slug: "conceptions/peftparameter-efficient-fine-tuning/adapter-tuning";
  body: string;
  collection: "markdown";
  data: any
} & { render(): Render[".md"] };
"conceptions/PEFT(Parameter-Efficient Fine-Tuning)/LoRA.md": {
	id: "conceptions/PEFT(Parameter-Efficient Fine-Tuning)/LoRA.md";
  slug: "conceptions/peftparameter-efficient-fine-tuning/lora";
  body: string;
  collection: "markdown";
  data: any
} & { render(): Render[".md"] };
"conceptions/PEFT(Parameter-Efficient Fine-Tuning)/P-tuning v2.md": {
	id: "conceptions/PEFT(Parameter-Efficient Fine-Tuning)/P-tuning v2.md";
  slug: "conceptions/peftparameter-efficient-fine-tuning/p-tuning-v2";
  body: string;
  collection: "markdown";
  data: any
} & { render(): Render[".md"] };
"conceptions/PEFT(Parameter-Efficient Fine-Tuning)/P-tuning.md": {
	id: "conceptions/PEFT(Parameter-Efficient Fine-Tuning)/P-tuning.md";
  slug: "conceptions/peftparameter-efficient-fine-tuning/p-tuning";
  body: string;
  collection: "markdown";
  data: any
} & { render(): Render[".md"] };
"conceptions/PEFT(Parameter-Efficient Fine-Tuning)/Prefix Tuning.md": {
	id: "conceptions/PEFT(Parameter-Efficient Fine-Tuning)/Prefix Tuning.md";
  slug: "conceptions/peftparameter-efficient-fine-tuning/prefix-tuning";
  body: string;
  collection: "markdown";
  data: any
} & { render(): Render[".md"] };
"conceptions/PEFT(Parameter-Efficient Fine-Tuning)/Prompt Tuning.md": {
	id: "conceptions/PEFT(Parameter-Efficient Fine-Tuning)/Prompt Tuning.md";
  slug: "conceptions/peftparameter-efficient-fine-tuning/prompt-tuning";
  body: string;
  collection: "markdown";
  data: any
} & { render(): Render[".md"] };
"conceptions/PPO(Proximal Policy Optimization).md": {
	id: "conceptions/PPO(Proximal Policy Optimization).md";
  slug: "conceptions/ppoproximal-policy-optimization";
  body: string;
  collection: "markdown";
  data: any
} & { render(): Render[".md"] };
"conceptions/Paged Attention.md": {
	id: "conceptions/Paged Attention.md";
  slug: "conceptions/paged-attention";
  body: string;
  collection: "markdown";
  data: any
} & { render(): Render[".md"] };
"conceptions/RMSNorm.md": {
	id: "conceptions/RMSNorm.md";
  slug: "conceptions/rmsnorm";
  body: string;
  collection: "markdown";
  data: any
} & { render(): Render[".md"] };
"conceptions/RoPE.md": {
	id: "conceptions/RoPE.md";
  slug: "conceptions/rope";
  body: string;
  collection: "markdown";
  data: any
} & { render(): Render[".md"] };
"conceptions/SWA(Sliding Window Attention).md": {
	id: "conceptions/SWA(Sliding Window Attention).md";
  slug: "conceptions/swasliding-window-attention";
  body: string;
  collection: "markdown";
  data: any
} & { render(): Render[".md"] };
"conceptions/TUPE(Transformer with Untied Positional Encoding).md": {
	id: "conceptions/TUPE(Transformer with Untied Positional Encoding).md";
  slug: "conceptions/tupetransformer-with-untied-positional-encoding";
  body: string;
  collection: "markdown";
  data: any
} & { render(): Render[".md"] };
"conceptions/on policy.md": {
	id: "conceptions/on policy.md";
  slug: "conceptions/on-policy";
  body: string;
  collection: "markdown";
  data: any
} & { render(): Render[".md"] };
"conceptions/位置编码(Positional Encoding).md": {
	id: "conceptions/位置编码(Positional Encoding).md";
  slug: "conceptions/位置编码positional-encoding";
  body: string;
  collection: "markdown";
  data: any
} & { render(): Render[".md"] };
"conceptions/时间卷积网络(TCN).md": {
	id: "conceptions/时间卷积网络(TCN).md";
  slug: "conceptions/时间卷积网络tcn";
  body: string;
  collection: "markdown";
  data: any
} & { render(): Render[".md"] };
"conceptions/集成学习(ensemble learning).md": {
	id: "conceptions/集成学习(ensemble learning).md";
  slug: "conceptions/集成学习ensemble-learning";
  body: string;
  collection: "markdown";
  data: any
} & { render(): Render[".md"] };
"models/DeiT.md": {
	id: "models/DeiT.md";
  slug: "models/deit";
  body: string;
  collection: "markdown";
  data: any
} & { render(): Render[".md"] };
"models/Diffusion Transformer (DiT).md": {
	id: "models/Diffusion Transformer (DiT).md";
  slug: "models/diffusion-transformer-dit";
  body: string;
  collection: "markdown";
  data: any
} & { render(): Render[".md"] };
"models/Effective Transformer.md": {
	id: "models/Effective Transformer.md";
  slug: "models/effective-transformer";
  body: string;
  collection: "markdown";
  data: any
} & { render(): Render[".md"] };
"models/Graph Convolution Networks(GCN).md": {
	id: "models/Graph Convolution Networks(GCN).md";
  slug: "models/graph-convolution-networksgcn";
  body: string;
  collection: "markdown";
  data: any
} & { render(): Render[".md"] };
"models/Graphormer.md": {
	id: "models/Graphormer.md";
  slug: "models/graphormer";
  body: string;
  collection: "markdown";
  data: any
} & { render(): Render[".md"] };
"models/LLaMA.md": {
	id: "models/LLaMA.md";
  slug: "models/llama";
  body: string;
  collection: "markdown";
  data: any
} & { render(): Render[".md"] };
"models/Llama 2.md": {
	id: "models/Llama 2.md";
  slug: "models/llama-2";
  body: string;
  collection: "markdown";
  data: any
} & { render(): Render[".md"] };
"models/Mixtral-8x7B.md": {
	id: "models/Mixtral-8x7B.md";
  slug: "models/mixtral-8x7b";
  body: string;
  collection: "markdown";
  data: any
} & { render(): Render[".md"] };
"models/Switch Transformer.md": {
	id: "models/Switch Transformer.md";
  slug: "models/switch-transformer";
  body: string;
  collection: "markdown";
  data: any
} & { render(): Render[".md"] };
"models/TurboTransformers.md": {
	id: "models/TurboTransformers.md";
  slug: "models/turbotransformers";
  body: string;
  collection: "markdown";
  data: any
} & { render(): Render[".md"] };
"models/UVCGAN v2.md": {
	id: "models/UVCGAN v2.md";
  slug: "models/uvcgan-v2";
  body: string;
  collection: "markdown";
  data: any
} & { render(): Render[".md"] };
"models/ViT(vision  transformer).md": {
	id: "models/ViT(vision  transformer).md";
  slug: "models/vitvision--transformer";
  body: string;
  collection: "markdown";
  data: any
} & { render(): Render[".md"] };
"papers/BatchMaker： Low Latency RNN Inference with Cellular Batching.md": {
	id: "papers/BatchMaker： Low Latency RNN Inference with Cellular Batching.md";
  slug: "papers/batchmaker-low-latency-rnn-inference-with-cellular-batching";
  body: string;
  collection: "markdown";
  data: any
} & { render(): Render[".md"] };
"papers/FastV.md": {
	id: "papers/FastV.md";
  slug: "papers/fastv";
  body: string;
  collection: "markdown";
  data: any
} & { render(): Render[".md"] };
"大模型推理优化--Prefill阶段seq_q切分 kimbaol kimbaol.md": {
	id: "大模型推理优化--Prefill阶段seq_q切分 kimbaol kimbaol.md";
  slug: "大模型推理优化--prefill阶段seq_q切分-kimbaol-kimbaol";
  body: string;
  collection: "markdown";
  data: any
} & { render(): Render[".md"] };
"强化学习：PPO （Proximal Policy Optimization）的来龙去脉.md": {
	id: "强化学习：PPO （Proximal Policy Optimization）的来龙去脉.md";
  slug: "强化学习ppo-proximal-policy-optimization的来龙去脉";
  body: string;
  collection: "markdown";
  data: any
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = never;
}
