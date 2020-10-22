# Introducing Loqu

Some decisions are make-or-break for new technologies. Back in 1980, a computer scientist named Tim-Berners Lee was working on a project called ENQUIRE.

<!-- It was a project focused on improving communication at CERN, a lab where he worked, by employing hyperlink technology. -->


Most of us have no idea what it was, and that's because he made a decision that all but garuanteed the project wouldn't be used outside of CERN. He decided that every page (in that system called a card) needed any page it wanted to link to to also link back to it. That meant that the data on the system might have been more complete, but it limited its scalability, because to change one page a user would have to update the pages that were linked to it.

After moving on to other things and coming back to ENQUIRE in 1984, he realized:

>  There was clearly a need for something like Enquire but accessable to everyone. I wanted it to scale so that if two people started to use it independently, and later started to work together, they could start linking together their information without making any other changes. This was the concept of the web. 

And thus the World Wide Web, the greatest network in the world, was born, with a key decision that enabled its growth: allow for broken links. Now, any page can link to any other item, including documents, files, applications, and pretty much any data imaginable.

A more mathematical definition of the network of the web is called a graph. There are several types, but all have two basic pieces: vertices (nodes) and edges (relations or links).

That decision he made was to allow for edges or links that pointed in one direction.

## The Semantic Web

In 1999, just around the time that half of the US population was starting to use the Web, Tim-Berners Lee and the group that he founded to manage the standards that make up the Web (the World Wide Web Consortium) started to think about some very complex and interesting problems that would really only present themselves fully over the next 20 years.

Building on the success of the graph network they had created in the regular Web, they envisioned a new Web, one where not just human-readable documents and files were linked, but one where data itself was linked. This vision is known as the Web 3.0

There is only so much a computer can understand about the world simply by looking at those documents, some which have links, some that don't. Most of those pages are written and designed exclusively for humans to understand. If machines wanted to understand the information described in those pages, they would have to have powerful machine learning and artificial intelligence algorithms that in 1999 wouldn't be available for 15 more years. Even then, the information gleaned from that process would be locked away in a neural network, where it can't be modified or updated by humans.

A short description is:
> The Semantic Web is an extension of the current web in which information is given well-defined meaning, better enabling computers and people to work in cooperation.

The Semantic Web effectively increases the resolution of the regular Web. While Web 1.0 linked between documents and files that computers couldn't understand, Web 3.0 was designed to link between abstract or concrete entities and data about those entities.

A key concept of graphs is the ability to make a **statement**, which is of the form: "subject predicate object." For example it could be "John likes Pizza," or "John parent Joe." Since edges of graphs are uni-directional, and edges always point from the subject to the object, the latter statement would mean that Joe is the parent of John.

## Two Steps Back

The promise of this framework seemed incredible: the ability to build a graph of virtually all knowledge on the web in a way that was structured and could enable entirely new possibilities.

Unfortunately, so much of technology is driven by consumer demand, and most consumers really wanted to use their website to buy stuff, but didn't really care whether the Web was a great representation of all knowledge.

If you told them: 10 years in the future, Siri will be 10x better, maybe they'd focus on it, but not likely. 

The area also faced challenges from developers who are lazy and just want to solve problems that are immediately clear to them. This was a solution to a problem people didn't really have.

In fact, most business incentives were pushing in the other direction.

https://people.well.com/user/doctorow/metacrap.htm
https://bibwild.wordpress.com/2014/10/28/is-the-semantic-web-still-a-thing/

## One Step Forward

Some fields have found enormous use for Semantic Web technologies, including publishing, media, library and information science, and biology and human sciences.

Additionally, enterprises, now recognizing that some computing applications work better on graph databases than traditional tabular databases have been moving those systems. As they work on deploying AI and Machine learning, like recommender systems, the semantic web provides them value by allowing them to reify or integrate data using unique identifiers.

Finally, there are some massive consumer-facing companies like Facebook and Twitter where the structure of their data is inherently network-based. Thus, they use lots of graph technologies behind the scenes. However, again it's against their incentizes to make that data public or share it with anyone else, so the need to use global identifiers that impart semantics, or even to use W3C standardized technologies is moot.

I believe that to most tech consumers, the Semantic Web is too abstract to make a difference. Why would they need machines to understand the data is they really just want to use one website?

Therefore, I think the way that we will see a resurgence of the promise of the Web 3.0 is by making the technology stack irresistible to developers.

There are several promising developments that could help in this direction:
- Users, especially at enterprises, want increasingly complex and powerful interfaces and visualizations
- As always developers are lazy and would rather not repeat all this in every situation
- Thus, they've invented a collection of frontend technologies known as Components, which are pieces of a user interface that can be reused and put together like building blocks by developers.
- If a system could automatically build a complete user interface for a developer but 