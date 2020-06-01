import {
	IMOSRunningOrder,
	MosString128,
	IMOSScope,
	IMOSROFullStory
 } from 'mos-connection'

type NormalizeMosAttributes<T> = {
	[P in keyof T]:
		T[P] extends MosString128 ?
		string :
		T[P] extends string | number | null | undefined ?
		T[P] :
		NormalizeMosAttributes<T[P]>
}


export const runningOrder: NormalizeMosAttributes<IMOSRunningOrder> = {
	ID: 'filename',
	Slug: 'Evening show',
	// DefaultChannel?: ''
	// EditorialStart?: MosTime;
	// EditorialDuration?: MosDuration;
	// Trigger?: ''
	// MacroIn?: ''
	// MacroOut?: ''
	MosExternalMetaData: [
		{
			MosSchema: 'http://MYMOSSCHEMA',
			MosPayload: {
				attribute: 'example'
			},
			MosScope: IMOSScope.PLAYLIST
		}
	],
	Stories: [
		{ Slug: 'TITLE A;STORY_A', ID: 'STORY_A', Items: [] },
		{ Slug: 'TITLE A;STORY_B', ID: 'STORY_B', Items: [] },
		{ Slug: 'TITLE A;STORY_C', ID: 'STORY_C', Items: [] },
		{ Slug: 'TITLE A;STORY_D', ID: 'STORY_D', Items: [] },
		{ Slug: 'TITLE B;STORY_E', ID: 'STORY_E', Items: [] },
		{ Slug: 'TITLE B;STORY_J', ID: 'STORY_J', Items: [] },
		{ Slug: 'TITLE C;STORY_K', ID: 'STORY_K', Items: [] },
		{ Slug: 'TITLE D;STORY_G', ID: 'STORY_G', Items: [] },
		{ Slug: 'TITLE D;STORY_H', ID: 'STORY_H', Items: [] },
		{ Slug: 'TITLE E;STORY_I', ID: 'STORY_I', Items: [] },
	]
}
export const fullStories: NormalizeMosAttributes<IMOSROFullStory>[] = [
	{
		ID: 'STORY_A',
		Slug: 'TITLE A;STORY_A',
		MosExternalMetaData: [
			{
				MosScope: IMOSScope.PLAYLIST,
				MosSchema: 'http://MYMOSSCHEMA',
				MosPayload: {
					attribute: 'example'
				}
			}
		],
		RunningOrderId: 'filename',
		Body: [
			{
				Type: 'p',
				Content: { '@name': 'p', '@type': 'element' }
			},
			{
				Type: 'storyItem',
				Content: {
					ID: '4',
					ObjectID: 'asdf1234',
					MOSID: 'SPECIAL.ID.MOS',
					Slug: 'The slug',
					MosExternalMetaData: [
						{
							MosScope: 'PLAYLIST',
							MosSchema: 'http://MYMOSSCHEMA2',
							MosPayload: {
								attribute: 'example'
							}
						}
					],
					mosAbstract: 'M: NRK Sørlandet (16-06-16 16:01)',
					ObjectSlug: 'M: NRK Sørlandet'
				}
			},
			{
				Type: 'p', Content: { text: 'This is an example text','@name': 'p', '@type': 'text' },
			}
		]
	}
]
