import { Metadata } from 'next'
import { Session } from 'next-auth'
import React from 'react'

import Title from '@components/Common/Title'
import MessageInput from '@components/Utils/MessageInput'
import VisitorMessage from '@components/Utils/VisitorMessage'
import siteMetadata from '@data/siteMetadata.json'
import { auth } from '@libs/auth'
import { findAll } from '@services/visitor'

const metadata = siteMetadata.internalLinks.find(
	(link) => link.title === 'Visitors'
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

const Visitor = async () => {
	const session: Session | null = await auth()
	const visitors: Visitor[] = await findAll()

	return (
		<>
			<Title primary={metadata!.title} secondary={metadata!.description} />
			<MessageInput session={session} />
			<div className="flex flex-col justify-center gap-10 text-center">
				{visitors.map((visitor, index) => (
					<>
						<VisitorMessage
							key={index}
							email={session?.user?.email}
							visitor={visitor}
							reverse={index % 2 === 0}
						/>
						{index !== visitors.length - 1 && (
							<div className="flex-col -space-y-5">
								<p className="text-4xl text-zinc-900">•</p>
								<div className="mx-auto h-28 w-min border border-zinc-900"></div>
								<p className="text-4xl text-zinc-900">•</p>
							</div>
						)}
					</>
				))}
			</div>
		</>
	)
}

export default Visitor