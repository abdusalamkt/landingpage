export default function News({ heading, bannerImage, post }) {
  return (
    <section>
      <h2>{heading}</h2>
      <img src={bannerImage.sourceUrl} alt={bannerImage.altText} width={300} />
      <article>
        <h3>{post.title}</h3>
        <div dangerouslySetInnerHTML={{ __html: post.excerpt }} />
        <img src={post.featuredImage.node.sourceUrl} alt={post.featuredImage.node.altText} width={150} />
      </article>
    </section>
  );
}
