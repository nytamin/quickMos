import { MosString128 } from 'mos-connection'

export type NormalizeMosAttributes<T> = {
	[P in keyof T]: T[P] extends MosString128
		? string
		: T[P] extends string | number | null | undefined
		? T[P]
		: NormalizeMosAttributes<T[P]>
}
