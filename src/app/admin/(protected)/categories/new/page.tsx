import CategoryForm from "../CategoryForm";

export default function NewCategoryPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-brand-text mb-6">
        Nova kategorija
      </h1>
      <CategoryForm />
    </div>
  );
}
