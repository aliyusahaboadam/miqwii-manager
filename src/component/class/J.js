



































   <div style={{cursor: 'pointer'}} onClick={() => toggleChevron('chevron-2')}  className={[navbar['collapsible'], navbar[activeChevron === 'chevron-2' ?  'collapsible--expanded' : null]].join(' ')} >
       <header  className={navbar['collapsible__header']}>
      <div  className={navbar['collapsible__icon']}>

      <svg  class={[navbar['collapsible--icon'], navbar['icon--primary']].join(' ')}>
            <use href="../images/sprite.svg#class"></use>
          </svg>
        <p  className={navbar['collapsible__heading']}>Classes</p>
      </div>
      
        
        <span onClick={() => toggleChevron('chevron-2')} className={navbar['icon-container']}>
            <svg className={[navbar['icon'], navbar['icon--primary'], navbar['icon--white'], navbar['collapsible--chevron']].join(' ')}>
                <use href="../images/sprite.svg#chevron"></use>
              </svg>
        </span>
    </header>
    

    <div className={navbar['collapsible__content--drawer']}>
    <a href="/class/jss-classes" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>JSS Classes</a>
    <a href="/class/sss-classes" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>SSS Classes</a>
    <a href="/class/primary-classes" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>Primary Classes</a>
<a href="/class/nursery-classes" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>Nursery Classes</a>
<a href="/class/pre-nursery-classes" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>Pre-Nursery Classes</a>
    <a href="/class/add-jss-class" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>Add JSS Class</a>
    <a href="/class/add-sss-class" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>Add SSS Class</a>
    <a href="/class/add-pri-class" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>Add Primary Class</a>
<a href="/class/add-nur-class" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>Add Nursery Class</a>
<a href="/class/add-pre-nur-class" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>Add Pre-Nursery Class</a>
    </div>

 </div> 