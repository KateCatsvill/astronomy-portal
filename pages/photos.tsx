import {
    getCatalogList,
    getPhotoList,
    getRunningQueriesThunk,
    useGetCatalogListQuery,
    useGetPhotoListQuery
} from '@/api/api'
import { wrapper } from '@/api/store'
import { TCatalog, TPhoto } from '@/api/types'
import { NextSeo } from 'next-seo'
import React from 'react'
import { Message } from 'semantic-ui-react'

import PhotoCategorySwitcher from '@/components/photo-category-switcher'
import PhotoGrid from '@/components/photo-grid'

export const getStaticProps = wrapper.getStaticProps((store) => async () => {
    store.dispatch(getCatalogList.initiate())
    store.dispatch(getPhotoList.initiate())

    await Promise.all(store.dispatch(getRunningQueriesThunk()))

    return {
        props: { object: {} }
    }
})

const Photos: React.FC = () => {
    const [category, setCategory] = React.useState('')
    const {
        data: photoData,
        isSuccess,
        isLoading,
        isError
    } = useGetPhotoListQuery()
    const { data: catalogData } = useGetCatalogListQuery()

    const listCategories = React.useMemo(() => {
        return catalogData && catalogData.payload.length
            ? catalogData.payload
                  .map((item) => item.category)
                  .filter(
                      (item, index, self) =>
                          item !== '' && self.indexOf(item) === index
                  )
            : []
    }, [catalogData])

    const listPhotos: (TPhoto & TCatalog)[] | any = React.useMemo(() => {
        return photoData?.payload.length
            ? photoData?.payload.map((photo) => {
                  const objectData = catalogData?.payload.filter(
                      (item) => item.name === photo.object
                  )
                  const objectInfo =
                      objectData && objectData.length ? objectData.pop() : null

                  if (objectInfo) {
                      return {
                          ...photo,
                          category: objectInfo.category,
                          text: objectInfo.text,
                          title: objectInfo.title
                      }
                  }

                  return photo
              })
            : []
    }, [photoData, catalogData])

    const listFilteredPhotos = React.useMemo(
        () =>
            listPhotos.length &&
            listPhotos.filter(
                (photo: TPhoto & TCatalog) =>
                    category === '' || photo.category === category
            ),
        [category, listPhotos]
    )

    return (
        <main>
            <NextSeo
                title={'Список фотографий'}
                description={
                    'Фотографии галактик, звезд, планет и других космических объектов, сделанных с помощью любительского телескопа'
                }
                openGraph={{
                    images: [
                        {
                            height: 743,
                            url: '/screenshots/photos.jpg',
                            width: 1280
                        }
                    ],
                    locale: 'ru'
                }}
            />
            {isError && (
                <Message
                    error
                    content={
                        'Возникла ошибка при получении списка отснятых объектов'
                    }
                />
            )}
            {isSuccess && (
                <PhotoCategorySwitcher
                    active={category}
                    categories={listCategories}
                    onSelectCategory={(category) => setCategory(category)}
                />
            )}
            <PhotoGrid
                loading={isLoading}
                photoList={listFilteredPhotos}
            />
        </main>
    )
}

export default Photos
