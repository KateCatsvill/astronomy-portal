import {
    useBlogGetListQuery // getRunningQueriesThunk,
} from '@/api/api'
import { NextSeo } from 'next-seo'
import React from 'react'

import BlogPage, { postPerPage } from '@/components/blog-page'

// export const getStaticProps = wrapper.getStaticProps((store) => async () => {
//     store.dispatch(getNewsList.initiate({ limit: 4, offset: 0 }))
//
//     await Promise.all(store.dispatch(getRunningQueriesThunk()))
//
//     return {
//         props: { object: {} }
//     }
// })

const Blog: React.FC = () => {
    const { data, isLoading } = useBlogGetListQuery({
        limit: postPerPage,
        offset: 0
    })

    return (
        <main>
            <NextSeo title={'Новости самодельной обсерватории'} />
            <BlogPage
                page={1}
                loading={isLoading}
                posts={data?.items}
                total={data?.total}
            />
        </main>
    )
}

export default Blog
