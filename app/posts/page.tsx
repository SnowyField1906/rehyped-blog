import { Metadata } from 'next'

import Heading from '@components/Common/Heading'
import Tag from '@components/Common/Tag'
import Title from '@components/Common/Title'
import PostPreview from '@components/Post/PostPreview'
import siteMetadata from '@data/siteMetadata.json'
import { getAllFrontmatters } from '@libs/markdown'

const metadata = siteMetadata.internalLinks.find(
	(link) => link.title === 'Posts'
)

export const generateMetadata = (): Metadata => {
	return {
		metadataBase: new URL(siteMetadata.siteUrl),
		title: metadata!.title + ' | ' + siteMetadata.headerTitle,
		description: metadata!.description,
		openGraph: {
			images: [siteMetadata.siteUrl + siteMetadata.siteBanner],
		},
	}
}

const Post = async ({
	searchParams,
}: {
	searchParams?: { [key: string]: string | undefined }
}) => {
	const _frontmatters: Frontmatter[] = getAllFrontmatters()
	const frontmatters: Frontmatter[] = _frontmatters.filter(
		(e) =>
			searchParams?.tag === undefined ||
			e.tags.includes(searchParams?.tag as string)
	)

	const _tags: string[] = _frontmatters.map((e) => e.tags).flat()
	const tags: [string, number][] = Object.entries(
		_tags.reduce((acc, tag) => {
			acc[tag] = (acc[tag] || 0) + 1
			return acc
		}, {})
	).sort((a: any, b: any) => b[1] - a[1])

	return (
		<main className="mx-auto mb-auto w-11/12 py-16 lg:w-3/4">
			<Heading heading={metadata!.description} />
			<Title title={metadata!.title} />
			<div className="flex gap-5 overflow-x-auto overflow-y-hidden pb-3">
				<Tag />
				{tags.map(([tag, count]) => (
					<Tag key={tag} name={tag} count={count} />
				))}
			</div>
			<div className="mx-auto max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
				<div className="grid gap-6 lg:grid-cols-2">
					{frontmatters.map((frontmatter) => (
						<PostPreview key={frontmatter.slug} frontmatter={frontmatter} />
					))}
				</div>
			</div>
		</main>
	)
}

export default Post
