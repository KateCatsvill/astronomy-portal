import {
    authorGetList,
    categoryGetList,
    getRunningQueriesThunk,
    useAuthorDeleteMutation,
    useAuthorGetListQuery,
    useCategoryDeleteMutation,
    useCategoryGetListQuery
} from '@/api/api'
import { useAppSelector } from '@/api/hooks'
import { wrapper } from '@/api/store'
import { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import React, { useState } from 'react'
import { Button, Confirm, Grid, Icon, Message } from 'semantic-ui-react'

import AuthorFormModal from '@/components/author-form-modal'
import AuthorTable from '@/components/author-table'
import CategoryFormModal from '@/components/category-form-modal'
import CategoryTable from '@/components/category-table'

export const getServerSideProps = wrapper.getServerSideProps(
    (store) => async () => {
        store.dispatch(authorGetList.initiate())
        store.dispatch(categoryGetList.initiate())

        await Promise.all(store.dispatch(getRunningQueriesThunk()))

        return {
            props: { object: {} }
        }
    }
)

const Directory: NextPage = () => {
    const [showMessage, setShowMessage] = useState<boolean>(false)
    const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false)
    const [showAuthorModal, setShowAuthorModal] = useState<boolean>(false)
    const [categoryDelete, showCategoryDelete] = useState<boolean>(false)
    const [authorDelete, showAuthorDelete] = useState<boolean>(false)
    const [modifyCatalogName, setModifyCatalogName] = useState<number>()
    const [modifyAuthorId, setModifyAuthorId] = useState<number>()

    const userAuth = useAppSelector((state) => state.auth.userAuth)

    const { data: categoriesData, isLoading: categoriesLoading } =
        useCategoryGetListQuery()

    const { data: authorsData, isLoading: authorsLoading } =
        useAuthorGetListQuery()

    const [
        deleteCategoryItem,
        {
            isLoading: deleteCategoryLoading,
            isSuccess: deleteCategorySuccess,
            isError: deleteCategoryError
        }
    ] = useCategoryDeleteMutation()

    const [
        deleteAuthorItem,
        {
            isLoading: deleteAuthorLoading,
            isSuccess: deleteAuthorSuccess,
            isError: deleteAuthorError
        }
    ] = useAuthorDeleteMutation()

    const handleAddCatalog = () => {
        setModifyCatalogName(undefined)
        setShowCategoryModal(true)
    }

    const handleAddAuthor = () => {
        setModifyAuthorId(undefined)
        setShowAuthorModal(true)
    }

    const handleEditCatalog = (item: number) => {
        setModifyCatalogName(item)
        setShowCategoryModal(true)
    }

    const handleEditAuthor = (item: number) => {
        setModifyAuthorId(item)
        setShowAuthorModal(true)
    }

    const handleDeleteCatalog = (item: number) => {
        setModifyCatalogName(item)
        showCategoryDelete(true)
    }

    const handleDeleteAuthor = (item: number) => {
        setModifyAuthorId(item)
        showAuthorDelete(true)
    }

    const confirmDeleteCatalog = () => {
        if (modifyCatalogName) {
            deleteCategoryItem(modifyCatalogName)
            setShowMessage(true)
            showCategoryDelete(false)
            setModifyCatalogName(undefined)
        }
    }

    const confirmDeleteAuthor = () => {
        if (modifyAuthorId) {
            deleteAuthorItem(modifyAuthorId)
            setShowMessage(true)
            showAuthorDelete(false)
            setModifyAuthorId(undefined)
        }
    }

    return (
        <main>
            <NextSeo title={'Справочники'} />
            <Grid className={'section'}>
                <Grid.Column
                    computer={8}
                    tablet={16}
                    mobile={16}
                >
                    {deleteCategoryError && (
                        <Message
                            error
                            onDismiss={() => {
                                setShowMessage(false)
                            }}
                            hidden={!showMessage}
                            header={'Ошибка удаления'}
                            content={
                                'При удалении объекта возникла ошибка, удаление временно невозможно'
                            }
                        />
                    )}
                    {deleteCategorySuccess && (
                        <Message
                            success
                            onDismiss={() => {
                                setShowMessage(false)
                            }}
                            hidden={!showMessage}
                            header={'Объект удален'}
                            content={'Все данные объекта успешно удалены'}
                        />
                    )}
                    <div className={'section'}>
                        <h4 className={'subTitle inline'}>
                            Категории объектов
                        </h4>
                        {userAuth && (
                            <Button
                                style={{ marginTop: -26 }}
                                icon={true}
                                floated={'right'}
                                labelPosition={'left'}
                                color={'yellow'}
                                size={'tiny'}
                                onClick={handleAddCatalog}
                            >
                                <Icon name={'plus'} />
                                Добавить
                            </Button>
                        )}
                    </div>
                    <CategoryTable
                        categories={categoriesData?.items}
                        loading={categoriesLoading || deleteCategoryLoading}
                        onClickEdit={handleEditCatalog}
                        onClickDelete={handleDeleteCatalog}
                    />
                </Grid.Column>
                <Grid.Column
                    computer={8}
                    tablet={16}
                    mobile={16}
                >
                    {deleteAuthorError && (
                        <Message
                            error
                            onDismiss={() => {
                                setShowMessage(false)
                            }}
                            hidden={!showMessage}
                            header={'Ошибка удаления'}
                            content={
                                'При удалении автора возникла ошибка, удаление временно невозможно'
                            }
                        />
                    )}
                    {deleteAuthorSuccess && (
                        <Message
                            success
                            onDismiss={() => {
                                setShowMessage(false)
                            }}
                            hidden={!showMessage}
                            header={'Объект удален'}
                            content={'Все данные автора успешно удалены'}
                        />
                    )}
                    <div className={'section'}>
                        <h4 className={'subTitle inline'}>Авторы фотографий</h4>
                        {userAuth && (
                            <Button
                                style={{ marginTop: -26 }}
                                icon={true}
                                floated={'right'}
                                labelPosition={'left'}
                                color={'yellow'}
                                size={'tiny'}
                                onClick={handleAddAuthor}
                            >
                                <Icon name={'plus'} />
                                Добавить
                            </Button>
                        )}
                    </div>
                    <AuthorTable
                        authors={authorsData?.items}
                        loading={authorsLoading || deleteAuthorLoading}
                        onClickEdit={handleEditAuthor}
                        onClickDelete={handleDeleteAuthor}
                    />
                </Grid.Column>
            </Grid>
            <CategoryFormModal
                visible={showCategoryModal}
                value={categoriesData?.items?.find(
                    ({ id }) => id === modifyCatalogName
                )}
                onClose={() => setShowCategoryModal(false)}
            />
            <AuthorFormModal
                visible={showAuthorModal}
                value={authorsData?.items?.find(
                    ({ id }) => id === modifyAuthorId
                )}
                onClose={() => setShowAuthorModal(false)}
            />
            <Confirm
                open={categoryDelete}
                size={'mini'}
                className={'confirm'}
                content={'Подтверждате удаление категории из каталога?'}
                onCancel={() => showCategoryDelete(false)}
                onConfirm={confirmDeleteCatalog}
            />
            <Confirm
                open={authorDelete}
                size={'mini'}
                className={'confirm'}
                content={'Подтверждате удаление автора из каталога?'}
                onCancel={() => showAuthorDelete(false)}
                onConfirm={confirmDeleteAuthor}
            />
        </main>
    )
}

export default Directory
