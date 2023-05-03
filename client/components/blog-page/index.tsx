import { useBlogGetListPopularQuery } from '@/api/api'
import { TBlog } from '@/api/types'
import classNames from 'classnames'
import moment from 'moment/moment'
import React from 'react'
import { Dimmer, Grid, Icon, Loader } from 'semantic-ui-react'

import PopularPosts from '@/components/blog-page/popularPosts'
import PostGallery from '@/components/blog-page/postGallery'
import styles from '@/components/blog-page/styles.module.sass'
import Pagination from '@/components/pagination'

export const postPerPage: number = 4

type TBlogPage = {
    loading?: boolean
    posts?: TBlog[]
    total?: number
    page?: number
}

const BlogPage: React.FC<TBlogPage> = ({ loading, posts, total, page }) => {
    const { data: popularPosts } = useBlogGetListPopularQuery()

    return (
        <Grid columns={2}>
            <Grid.Row>
                <Grid.Column
                    computer={9}
                    mobile={16}
                >
                    <div className={styles.postsList}>
                        <Dimmer active={loading}>
                            <Loader />
                        </Dimmer>
                        {posts?.map((item) => (
                            <div
                                className={classNames(styles.item, 'box')}
                                key={item.id}
                            >
                                {item.media && (
                                    <PostGallery
                                        media={item.media}
                                        groupId={item.group_id}
                                    />
                                )}
                                <p className={styles.text}>{item.text}</p>
                                <div className={styles.footer}>
                                    <span className={styles.parameter}>
                                        <Icon name='eye' /> {item.views}
                                    </span>
                                    <span className={styles.parameter}>
                                        <Icon name='reply' /> {item.forwards}
                                    </span>
                                    <span className={styles.parameter}>
                                        <Icon name='comment' /> {item.replies}
                                    </span>
                                    <span className={styles.parameter}>
                                        <Icon name='like' />{' '}
                                        {item.reactions?.reduce(
                                            (count: number, reaction) =>
                                                count + reaction.count,
                                            0
                                        ) || 0}
                                    </span>
                                    <div className={styles.date}>
                                        <a
                                            href={`https://t.me/nearspace/${item.telegram_id}`}
                                            title={'Прочитать новость в канале'}
                                            rel={'nofollow'}
                                        >
                                            {moment
                                                .unix(item.telegram_date)
                                                .format('DD MMMM Y в H:mm')}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Grid.Column>
                <Grid.Column
                    computer={7}
                    mobile={16}
                >
                    <PopularPosts posts={popularPosts?.items} />
                    <div className={'box'}>
                        <Pagination
                            currentPage={page}
                            totalPostCount={total}
                            perPage={postPerPage}
                            linkPart={'blog'}
                        />
                    </div>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}

export default BlogPage
