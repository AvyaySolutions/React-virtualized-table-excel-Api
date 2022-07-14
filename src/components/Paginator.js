import React from 'react'
import { Button } from 'semantic-ui-react'

const BetweenButton = () => <Button content='...' style={{ cursor: 'default' }} />

const Paginator = ({ currentPage, onPageChange, range = 3, pageCount }) => {
  const renderedPages = [...Array(range * 2 + 1).keys()]
    .map(i => currentPage - range + i)
    .filter(i => i > 0 && i <= pageCount)

  const showStart = currentPage - range > 1
  const showEnd = currentPage + range < pageCount

  return (
    <Button.Group compact>
      {showStart && (
        [
          <Button content={1} onClick={() => onPageChange(1)} />,
          <BetweenButton />
        ]
      )}
      {renderedPages.map(page => (
        <Button 
          key={page}
          onClick={() => onPageChange(page)} 
          content={page}
          primary={currentPage === page}
        />
      ))}
      {showEnd && (
        [
          <BetweenButton />, 
          <Button content={pageCount} onClick={() => onPageChange(pageCount)} />
        ]
      )}
    </Button.Group>
  )
}

export default Paginator