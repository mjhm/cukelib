# Universities, Please Teach Testing before Types

Even if I stumble on to the absolute truth of any aspect of the universe, I will not realise my luck and instead will spend my life trying to find flaws in this understanding - such is the role of a scientist. Brian Schmidt

So here's my complaint. At Originate I interview several candidates per month for entry level and intern programming positions. From their resume, a short online test, and about 40 minutes of watching them program, I need to assess whether they have the skills to thrive at Originate. As a final hurdle I ask a simple specific question about how to write a test for their code. Good senior developers get it immediately, often with useful variations. Entry level and interns -- almost never.

This blog post is about "absolute truth" in software development and by that I mean "testable" truth. Software development is the scientific method through a fun house mirror. In science we take a hypothesis about the universe, we test the hypothesis, and if the test fails we change our hypothesis and run a new test. Software development is way more fun, we still have a hypothesis and a universe, but when the test fails, we keep our hypothesis (aka requirement), and invoke our god-like power to change the universe (aka program). That's cool, but it gets even better, as I change my universe to fit today's hypothesis what happens to yesterday's hypothesis? If I've done my job right, I've saved yesterday's test, and can automatically run it to verify my previous edicts still hold. Eventually I've built a universe surrounded by tests that prove that it behaves exactly as I say it should. Then I can even become more bold and destroy and recreate worlds (aka refactor) within my universe and still be sure that my universe obeys my will.

My power trip depends on "automated tests". Every software developer verifies their software in one way or another, most often by just manually running it and checking the results. Such manual tests only establish absolute truth at a mere mortal's fleeting instant in time. Automated tests give the god-like power of controlling a universe. So from now on we are gods and "test" means "automated test".

Now back on planet earth -- the craft of modern professional programming requires [continuous integration[(http://martinfowler.com/articles/continuousIntegration.html) and [constant refactoring](https://www.agilealliance.org/glossary/refactoring/).  Indeed "deliver working software frequently" and welcoming change are cornerstones of the [Agile Manifesto](http://agilemanifesto.org/principles.html). Delivering working software requires testing, and delivering it frequently while welcoming change requires that testing is automated. In other words automated testing isn't so much about software reliability but rather automated testing is a requirement for the pace of agile development. Unfortunately under even the best circumstances it takes years for developers to gain the experience, instincts, and self-critical thinking for effective testing, and unfortunately CS graduates are not gaining these instincts in school. Indeed it's more likely that a graduate will be able to explain covariance than know when to stub a dependency. The result is a glut of mediocre software developers who work in waterfall (or cargo-cult agile) environments where the attitude toward testing is to throw it over the fence to a QA department.

Testing is hard because it doesn't come for free -- there are development costs, maintenance costs, and operational costs. As shown below there are some tests which are no-brainers to implement -- static analysis is very useful and costs next to nothing, and unit tests are generally pretty easy. And then there are tests which are clearly too difficult to be worth much effort -- such as HTML/CSS display details.

Testing is also hard because it takes courage. Both the courage to be hyper critical of your own code, and later the courage to delete tests that no longer serve a useful function. And the courage to admit what you don't know and learn to do better.

The developer's challenge is to create an environment where the testing costs can be reduced. Then more of the tests will land on the "Worth Testing" side of the graph -- especially the high value tests.

Furthermore the constellation of tests on this graph varies from project to pr



Testing Cost/Benefit

What makes testing most challenging is that writing tests come with a cost and unfortunately the cost doesn't always outweigh the benefit.

How to fix this? I've got two suggestions -- first an attitude adjustment, and a crazy curriculum change.

Testing Attitude for Agile Development

2. For agile development testing always means automated testing. Manual testing doesn't count for much, and therefore...
3. Any manual test is a missed opportunity for an automated test.
3. Every bug is a sign of a missing test.
4. If a feature is too difficult to test, then either the code is too complicated, or the test framework is too weak, or both.
5. Every software requirement should be viewed as two exercises: How do I program it? AND How do I test it?

That last part -- adopting a "How do I test it?" attitude is key and deceptively difficult. It needs to be broken down into several questions?

1. What exactly am I testing?
2. What are the essential cases?
3. What are the error and exception cases?
5. Do I stub or integrate dependencies?
4. Can I simplify the tests, by reducing incidental details or orthogonalizing expectations?
5. Are the tests still too complicated -- AKA do I need to reorganize/refactor my code to make it testable?
4. How do I most efficiently automate the tests?
6. Finally -- are these tests sufficient to satisfy the "deliver working software frequently" and "welcoming change" mandates of the agile principles? (Hint: If you still feel the urge to manually test, you aren't there yet.)

Sure there are very helpful TDD, BDD, Cucumber, and other schools of thinking and best practices around these questions, but blindly applying them is just cargo-cult. It actually takes practice and experience to become efficient and effective.

Crazy Curriculum Change

I'm going to go out on a limb here and state that it's far more important that CS majors learn how to test, than to learn category theory or even static OOP. So here's my suggestion. Stop teaching Java and C++ in lower division courses, teach JavaScript and C instead and require thoughtful testing. Get the students to lean heavily on testing before they are exposed to static types. Both JavaScript and C are pervasive and utilitarian, and both require testing to do anything substantial or supportable.

My favorite thing about JavaScript is that as a good language it is indefensible. The best thing anyone can ever say about it is that it has some good parts. However it is inarguably pervasive and utilitarian. Furthermore the Herculean efforts of a handful of brilliant developers and the support of a desperate community have built a stunning ecosystem of frameworks, tooling, patterns, and practices. A bi-product of this development is a strong and growing culture of testing. Indeed it's practically impossible to write supportable JavaScript without tests.

So here are my problems with teaching static types too soon.

First it gives an illusion of safety where it doesn't exist. Students get the mistaken assumption that "type safety" is an absolute when it's merely relative. Real world programs aren't immune from runtime errors or exceptions in any language.

Type systems create an expanding walled garden effect. Static typed languages work well and are seductively elegant as long as you play by their rules. But runtime interfaces among systems rarely play by the same static typing rules. This creates an incentive toward consolidating functionality within a single system's statically typed walled garden, and against independently developed and independently tested modules.

IKEA effect. This is a well know psychological bias that has been commercially exploited by IKEA. Researchers have demonstrated that when subjects complete a construction task they value the result more than if they bought the same item already constructed. Furthermore artificially added obstacles actually increase the value of the result. However many times I've heard developers say that they prefer statically typed language X because they know that once it compiles "it just works".  

My Ulterior Motive

Testing is still too hard. There are too many established areas which are too difficult to test. And there are definitely areas where the cost of testing outweighs the benefits. We've made a lot of progress. Twenty years ago automated testing was all but impossible.

Testing tips
1. Isolate volatile code. Harness the non-volatile code with tests so that you don't need to ever worry about it.
2. Don't worry about doing testing wrong. You'll get better at it the more you do. Furthermore testing techniques, tools, and best practices are evolving as fast as anything else in software development. So expect to change and refactor your testing strategies periodically.
3. Evangelize testing.
4. Strive to eliminate incidental details, and orthogonalize tests.

Why Test
1. Accelerates development.
2.

When not to test.
1. Purely declarative view code.
2. One-off single use scripts
3. Code with trivial failure consequences.
4. Highly volatile proof-of-concept code.


-----------------

Blind faith, no matter how passionately expressed, will not suffice. Science for its part will test relentlessly every assumption about the human condition. E. O. Wilson

I value challenging assumptions, and I also value absolute truth when it can be found. Isn't critical thinking what separates a university eduction from a trade school.

I value the democratization of coding. I value programming craftsmanship. I value challenging assumptions and identifying and holding to truth when it can be found.


For the programming assessments I let candidates program in their favored language. When they choose Java I know that the interview is going to take at least 5 minutes longer as the candidate fusses over type trivialities rather than core algorithm tasks. Python choosers get to the point fastest, and those with JavaScript can be poor or excellent. Regardless of language, when the candidate gets through everything else, I ask a specific question about how to write a test for their code. Good senior developers get it immediately, often with useful variations. Entry level and interns -- almost never.
