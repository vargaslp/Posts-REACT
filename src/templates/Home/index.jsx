import './styles.css';
import { Component } from 'react';
import { loadPosts } from '../../utils/load-posts';
import { Posts } from '../../components/Posts';
import { Button } from '../../components/Button';
import { TextInput } from '../../components/TextImput';


export class Home extends Component {
  state = {
    posts: [],
    allPosts: [],
    page: 0,
    postsPerPage: 5,
    searchValue: ''
  }


  async componentDidMount() {

    await this.loadPosts()
  }

  loadPosts = async () => {
    const { page, postsPerPage } = this.state
    const postsAndPhotos = await loadPosts()
    this.setState({
      posts: postsAndPhotos.slice(page, postsPerPage),
      allPosts: postsAndPhotos
    })
  }

  loadMorePosts = () => {

    const { page, postsPerPage, allPosts, posts } = this.state
    const nextPage = page + postsPerPage
    const nextPosts = allPosts.slice(nextPage, postsPerPage + nextPage)
    posts.push(...nextPosts)

    this.setState({ posts, page: nextPage })


  }

  handleChange = (e) => {
    const { value } = e.target
    this.setState({ searchValue: value })

  }


  render() {

    const { posts, page, postsPerPage, allPosts, searchValue } = this.state
    const noMorePosts = page + postsPerPage >= allPosts.length
    const filteredPosts = !!searchValue ? allPosts.filter(post => {
      return post.title.toLowerCase().includes(searchValue.toLocaleLowerCase())
    }) : posts


    return (
      <section className="container">
        <div className='search-container'>

          {!!searchValue && (<h1>Pesquisar: {searchValue}</h1>
          )}
          <TextInput searchValue={searchValue} handleChange={this.handleChange} />

        </div>

        {filteredPosts.length > 0 && (
          <Posts posts={filteredPosts} />
        )}

        {filteredPosts.length === 0 && (
          <p>Não há posts com essa palavra no título</p>
        )}

        <div className='button-container'>
          {!searchValue && (
            <Button
              disabled={noMorePosts}
              text={"Carregar mais posts"}
              onClick={this.loadMorePosts}
            />
          )}
        </div>

      </section>
    )
  }

}
