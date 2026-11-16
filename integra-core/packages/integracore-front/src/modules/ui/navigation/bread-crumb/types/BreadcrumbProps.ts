import { type BreadcrumbItem } from 'integracore-ui/primitives/navigation';

export type BreadcrumbProps = {
  links: Pick<BreadcrumbItem, 'children' | 'href'>[];
};
