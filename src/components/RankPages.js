import React from 'react';
import { Pagination, PaginationItem } from 'semantic-ui-react';

const RankPages = ({ usersPerPage, totalUsers, paginate }) => {
  const pages = Math.ceil(totalUsers / usersPerPage);

  const onClick = (e, { activePage }) => {
    paginate(activePage);
  };
  return (
    <Pagination
      boundaryRange={0}
      defaultActivePage={1}
      ellipsisItem={null}
      totalPages={pages}
      onPageChange={onClick}
      siblingRange={1}
    />
  );
};

export default RankPages;
