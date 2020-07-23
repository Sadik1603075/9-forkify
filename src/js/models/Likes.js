

export default class Likes{
    constructor()
    {
        this.likes=[];
    }

    addLike(id,title,author,img)
    {
        const newLike={id,
        title,
        author,
        img}
        this.likes.push(newLike);

        this.persistData();
        return newLike;
    }

    deleteLike(id)
    {
        const nid = this.likes.findIndex(el=>el.id===id);
        this.likes.splice(nid,1);
        this.persistData();
    }

    isLiked(id)
    {
        return this.likes.findIndex(el=>el.id===id)!==-1;
    }
    getNumLike()
    {
        return this.likes.length;
    }

    persistData()
    {
        localStorage.setItem('likes',JSON.stringify(this.likes));
    }

    readStorage()
    {
        const storage =JSON.parse( localStorage.getItem('likes'));
        if(storage)this.likes=storage;
    }

}